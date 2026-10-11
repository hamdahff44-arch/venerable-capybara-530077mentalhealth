import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  AuthError,
  acceptInvite,
  handleAuthCallback,
  login,
  requestPasswordRecovery,
  updateUser,
} from '@netlify/identity'
import { Check, Download, EyeOff, Loader2, LogOut, RefreshCw, RotateCcw, Search, Trash2 } from 'lucide-react'
import { Heart, Sprig } from '../components/Decor'
import { useIdentity } from '../lib/identity-context'
import { deleteEntry, getAdminEntries, setEntryStatus, type AdminEntry } from '../lib/submissions'
import {
  CATEGORIES,
  PARTICIPANT_TYPES,
  PUBLIC_STATUSES,
  STATUSES,
  type Status,
} from '../lib/options'

export const Route = createFileRoute('/admin')({
  head: () => ({
    meta: [{ title: 'لوحة مراجعة المشاركات · أثر طيب' }, { name: 'robots', content: 'noindex, nofollow' }],
  }),
  ssr: false,
  component: AdminPage,
})

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="paper min-h-screen px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <a href="/" className="mb-8 inline-flex items-center gap-2 text-plum">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-blush text-rosewood">
            <Heart className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-bold">أثر طيب · العودة للموقع</span>
        </a>
        {children}
      </div>
    </div>
  )
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-md rounded-[2rem] bg-ivory p-8 shadow-xl shadow-plum/10 ring-1 ring-beige">{children}</div>
}

function authMessage(err: unknown) {
  if (err instanceof AuthError) {
    if (err.status === 401 || err.status === 400) return 'البريد الإلكتروني أو كلمة المرور غير صحيحة.'
    if (err.status === 422) return 'تحققي من البيانات المدخلة (كلمة المرور ٨ أحرف على الأقل).'
    return err.message
  }
  return 'حدث خطأ غير متوقع. حاولي مرة أخرى.'
}

function LoginForm() {
  const [mode, setMode] = useState<'login' | 'forgot'>('login')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const f = new FormData(e.currentTarget)
    const email = String(f.get('email'))
    setBusy(true)
    setMsg(null)
    try {
      if (mode === 'login') {
        await login(email, String(f.get('password')))
      } else {
        await requestPasswordRecovery(email)
        setMsg({ ok: true, text: 'إن كان البريد مسجلًا، فستصلك رسالة لإعادة تعيين كلمة المرور.' })
      }
    } catch (err) {
      setMsg({ ok: false, text: authMessage(err) })
    } finally {
      setBusy(false)
    }
  }

  return (
    <Card>
      <Sprig className="h-7 w-28" />
      <h1 className="mt-3 font-display text-2xl font-bold text-plum">{mode === 'login' ? 'دخول إدارة المبادرة' : 'استعادة كلمة المرور'}</h1>
      <p className="mt-1 text-sm text-ink/70">هذه الصفحة مخصصة لمشرفات المبادرة لمتابعة المشاركات المنشورة تلقائيًا وإخفاء غير المناسب منها.</p>
      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-plum">البريد الإلكتروني</span>
          <input name="email" type="email" required dir="ltr" className="field text-left" autoComplete="email" />
        </label>
        {mode === 'login' && (
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-plum">كلمة المرور</span>
            <input name="password" type="password" required dir="ltr" className="field text-left" autoComplete="current-password" />
          </label>
        )}
        {msg && <p className={`rounded-2xl px-4 py-2.5 text-sm ${msg.ok ? 'bg-sage-light text-moss' : 'bg-blush/60 text-plum'}`}>{msg.text}</p>}
        <button disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-full bg-rosewood px-6 py-3 font-medium text-white transition hover:bg-plum disabled:opacity-70">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          {mode === 'login' ? 'دخول' : 'إرسال رابط الاستعادة'}
        </button>
        <button type="button" onClick={() => { setMode(mode === 'login' ? 'forgot' : 'login'); setMsg(null) }} className="text-sm text-rosewood hover:underline">
          {mode === 'login' ? 'نسيتِ كلمة المرور؟' : 'العودة لتسجيل الدخول'}
        </button>
      </form>
    </Card>
  )
}

function SetPasswordForm({ title, onSubmit }: { title: string; onSubmit: (password: string) => Promise<void> }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  return (
    <Card>
      <h1 className="font-display text-2xl font-bold text-plum">{title}</h1>
      <form
        className="mt-6 grid gap-4"
        onSubmit={async (e) => {
          e.preventDefault()
          const password = String(new FormData(e.currentTarget).get('password'))
          setBusy(true)
          setError('')
          try {
            await onSubmit(password)
          } catch (err) {
            setError(authMessage(err))
          } finally {
            setBusy(false)
          }
        }}
      >
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-plum">كلمة المرور الجديدة</span>
          <input name="password" type="password" minLength={8} required dir="ltr" className="field text-left" autoComplete="new-password" />
        </label>
        {error && <p className="rounded-2xl bg-blush/60 px-4 py-2.5 text-sm text-plum">{error}</p>}
        <button disabled={busy} className="inline-flex items-center justify-center gap-2 rounded-full bg-rosewood px-6 py-3 font-medium text-white hover:bg-plum disabled:opacity-70">
          {busy && <Loader2 className="h-4 w-4 animate-spin" />} حفظ كلمة المرور
        </button>
      </form>
    </Card>
  )
}

function AdminPage() {
  const { user, ready, logout } = useIdentity()
  const [callback, setCallback] = useState<{ type: 'invite'; token: string } | { type: 'recovery' } | null>(null)

  useEffect(() => {
    if (!/^#(invite_token|recovery_token|confirmation_token|access_token)=/.test(window.location.hash)) return
    handleAuthCallback()
      .then((r) => {
        if (r?.type === 'invite' && r.token) setCallback({ type: 'invite', token: r.token })
        else if (r?.type === 'recovery') setCallback({ type: 'recovery' })
      })
      .catch(() => {})
      .finally(() => history.replaceState(null, '', '/admin'))
  }, [])

  if (callback?.type === 'invite') {
    return (
      <Shell>
        <SetPasswordForm
          title="مرحبًا بكِ في فريق المبادرة 💗 اختاري كلمة مرور"
          onSubmit={async (pw) => {
            await acceptInvite(callback.token, pw)
            setCallback(null)
          }}
        />
      </Shell>
    )
  }
  if (callback?.type === 'recovery') {
    return (
      <Shell>
        <SetPasswordForm
          title="تعيين كلمة مرور جديدة"
          onSubmit={async (pw) => {
            await updateUser({ password: pw })
            setCallback(null)
          }}
        />
      </Shell>
    )
  }

  if (!ready) {
    return (
      <Shell>
        <div className="grid place-items-center py-24 text-moss">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </Shell>
    )
  }

  if (!user) {
    return (
      <Shell>
        <LoginForm />
      </Shell>
    )
  }

  if (!user.roles?.includes('admin')) {
    return (
      <Shell>
        <Card>
          <h1 className="font-display text-2xl font-bold text-plum">لا تملكين صلاحية المراجعة بعد</h1>
          <p className="mt-3 text-ink/75">
            تم تسجيل دخولك باسم <bdi dir="ltr">{user.email}</bdi>، لكن حسابك لا يحمل دور «admin». يمكن لمسؤول الموقع إضافة هذا الدور من لوحة
            Netlify ← Identity ← اختيار المستخدم ← Roles.
          </p>
          <button onClick={() => logout()} className="mt-6 inline-flex items-center gap-2 rounded-full bg-cream px-5 py-2.5 text-plum ring-1 ring-beige">
            <LogOut className="h-4 w-4" /> تسجيل الخروج
          </button>
        </Card>
      </Shell>
    )
  }

  return (
    <Shell>
      <Dashboard email={user.email ?? ''} onLogout={() => logout()} />
    </Shell>
  )
}

function toCsv(rows: AdminEntry[]) {
  const head = ['id', 'التاريخ', 'الحالة', 'النوع', 'الصفة', 'الاسم', 'إلى', 'الرسالة']
  const esc = (v: string) => `"${v.replaceAll('"', '""')}"`
  const lines = rows.map((r) =>
    [
      String(r.id),
      new Date(r.createdAt).toLocaleString('ar-SA'),
      STATUSES[r.status as Status] ?? r.status,
      CATEGORIES[r.category as keyof typeof CATEGORIES] ?? r.category,
      PARTICIPANT_TYPES[r.participantType as keyof typeof PARTICIPANT_TYPES] ?? r.participantType,
      r.name ?? '',
      r.recipient ?? '',
      r.message,
    ]
      .map(esc)
      .join(','),
  )
  return '﻿' + [head.map(esc).join(','), ...lines].join('\n')
}

function Dashboard({ email, onLogout }: { email: string; onLogout: () => void }) {
  const [entries, setEntries] = useState<AdminEntry[] | null>(null)
  const [error, setError] = useState('')
  const [status, setStatus] = useState<Status | 'all'>('all')
  const [category, setCategory] = useState<string>('all')
  const [query, setQuery] = useState('')
  const [busyId, setBusyId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setError('')
    try {
      setEntries(await getAdminEntries())
    } catch {
      setError('تعذّر تحميل المشاركات. قد تكون جلستك انتهت؛ حاولي تحديث الصفحة أو تسجيل الدخول مجددًا.')
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const counts = useMemo(() => {
    const c = { all: 0, pending: 0, approved: 0, rejected: 0 } as Record<string, number>
    entries?.forEach((e) => {
      c.all++
      c[e.status] = (c[e.status] ?? 0) + 1
    })
    return c
  }, [entries])

  const filtered = useMemo(() => {
    const q = query.trim()
    return (entries ?? []).filter(
      (e) =>
        (status === 'all' || e.status === status) &&
        (category === 'all' || e.category === category) &&
        (!q || e.message.includes(q) || (e.name ?? '').includes(q) || (e.recipient ?? '').includes(q)),
    )
  }, [entries, status, category, query])

  async function changeStatus(id: number, next: Status) {
    setBusyId(id)
    try {
      await setEntryStatus({ data: { id, status: next } })
      setEntries((list) => list?.map((e) => (e.id === id ? { ...e, status: next, reviewedAt: next === 'pending' ? null : new Date().toISOString() } : e)) ?? null)
    } catch {
      setError('تعذّر تحديث المشاركة. حاولي مرة أخرى.')
    } finally {
      setBusyId(null)
    }
  }

  async function remove(id: number) {
    if (!confirm('هل تريدين حذف هذه المشاركة نهائيًا؟')) return
    setBusyId(id)
    try {
      await deleteEntry({ data: { id } })
      setEntries((list) => list?.filter((e) => e.id !== id) ?? null)
    } catch {
      setError('تعذّر حذف المشاركة.')
    } finally {
      setBusyId(null)
    }
  }

  function exportCsv() {
    const blob = new Blob([toCsv(filtered)], { type: 'text/csv;charset=utf-8' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `athar-submissions-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-plum">لوحة مراجعة المشاركات</h1>
          <p className="mt-1 text-ink/70">
            مرحبًا <bdi dir="ltr">{email}</bdi> — تُنشر جميع المشاركات تلقائيًا. راجعيها بعد النشر وأخفي غير المناسب منها؛ المشاركات القديمة غير المراجعة ظاهرة أيضًا.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="inline-flex items-center gap-2 rounded-full bg-ivory px-4 py-2 text-sm text-plum ring-1 ring-beige hover:bg-blush/40">
            <RefreshCw className="h-4 w-4" /> تحديث
          </button>
          <button onClick={exportCsv} disabled={!filtered.length} className="inline-flex items-center gap-2 rounded-full bg-ivory px-4 py-2 text-sm text-plum ring-1 ring-beige hover:bg-blush/40 disabled:opacity-50">
            <Download className="h-4 w-4" /> تصدير CSV
          </button>
          <button onClick={onLogout} className="inline-flex items-center gap-2 rounded-full bg-plum px-4 py-2 text-sm text-cream">
            <LogOut className="h-4 w-4" /> خروج
          </button>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {(['pending', 'approved', 'rejected', 'all'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            aria-pressed={status === s}
            className={`rounded-3xl p-5 text-right ring-1 transition ${status === s ? 'bg-plum text-cream ring-plum' : 'bg-ivory ring-beige hover:ring-rose'}`}
          >
            <span className="block font-display text-3xl font-bold">{(counts[s] ?? 0).toLocaleString('ar-SA')}</span>
            <span className={`text-sm ${status === s ? 'text-cream/80' : 'text-ink/65'}`}>{s === 'all' ? 'كل المشاركات' : STATUSES[s]}</span>
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="field w-auto">
          <option value="all">كل الأنواع</option>
          {Object.entries(CATEGORIES).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
        <label className="relative min-w-56 flex-1">
          <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="ابحثي في الرسائل والأسماء…" className="field pr-11" />
        </label>
      </div>

      {error && <p className="mt-5 rounded-2xl bg-blush/60 px-4 py-3 text-plum">{error}</p>}

      {entries === null && !error ? (
        <div className="grid place-items-center py-20 text-moss">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-8 rounded-3xl bg-ivory p-10 text-center text-ink/60 ring-1 ring-beige">لا توجد مشاركات في هذا التصنيف حاليًا.</p>
      ) : (
        <ul className="mt-6 grid gap-4">
          {filtered.map((e) => {
            const isPublic = PUBLIC_STATUSES.includes(e.status as Status)
            const busy = busyId === e.id
            return (
              <li key={e.id} className="rounded-3xl bg-ivory p-5 ring-1 ring-beige sm:p-6">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className={`rounded-full px-3 py-1 font-medium ${e.status === 'approved' ? 'bg-sage-light text-moss' : e.status === 'rejected' ? 'bg-beige text-ink/70' : 'bg-blush text-rosewood'}`}>
                    {STATUSES[e.status as Status]}
                  </span>
                  <span className="rounded-full bg-cream px-3 py-1 text-plum ring-1 ring-beige">{CATEGORIES[e.category as keyof typeof CATEGORIES]}</span>
                  <span className="text-ink/55">
                    {PARTICIPANT_TYPES[e.participantType as keyof typeof PARTICIPANT_TYPES]}
                    {e.name ? ` · ${e.name}` : ' · بدون اسم'}
                    {e.recipient ? ` · إلى ${e.recipient}` : ''}
                  </span>
                  <span className="ms-auto text-ink/45">{new Date(e.createdAt).toLocaleString('ar-SA', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                </div>
                <p className="mt-3 whitespace-pre-line text-lg leading-8 text-ink">{e.message}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {e.status !== 'approved' && (
                    <button disabled={busy} onClick={() => changeStatus(e.id, 'approved')} className="inline-flex items-center gap-1.5 rounded-full bg-moss px-4 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60">
                      <Check className="h-4 w-4" /> {isPublic ? 'تمت المراجعة — تبقى منشورة' : 'إعادة النشر'}
                    </button>
                  )}
                  {e.status !== 'rejected' && (
                    <button disabled={busy} onClick={() => changeStatus(e.id, 'rejected')} className="inline-flex items-center gap-1.5 rounded-full bg-cream px-4 py-2 text-sm text-plum ring-1 ring-beige hover:bg-beige/60 disabled:opacity-60">
                      <EyeOff className="h-4 w-4" /> إخفاء من الموقع
                    </button>
                  )}
                  {e.status !== 'pending' && (
                    <button disabled={busy} onClick={() => changeStatus(e.id, 'pending')} className="inline-flex items-center gap-1.5 rounded-full bg-cream px-4 py-2 text-sm text-plum ring-1 ring-beige hover:bg-beige/60 disabled:opacity-60">
                      <RotateCcw className="h-4 w-4" /> غير مراجعة — تظهر للجميع
                    </button>
                  )}
                  <button disabled={busy} onClick={() => remove(e.id)} className="ms-auto inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm text-rosewood hover:bg-blush/50 disabled:opacity-60">
                    <Trash2 className="h-4 w-4" /> حذف
                  </button>
                  {isPublic && <span className="self-center text-sm text-ink/50">💗 {e.hearts.toLocaleString('ar-SA')}</span>}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
