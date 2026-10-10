import { useRef, useState, type FormEvent } from 'react'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { submitEntry } from '../lib/submissions'
import { CATEGORIES, MESSAGE_MAX, NAME_MAX, PARTICIPANT_TYPES, type Category } from '../lib/options'

// Must match the static form in public/__forms.html, which Netlify detects at build time.
// We post to that file's path because '/' is handled by the SSR function, not Netlify Forms.
const NETLIFY_FORM_NAME = 'athar-tayeb'
const NETLIFY_FORM_ENDPOINT = '/__forms.html'

type Props = {
  /** When set, the category picker is hidden and every entry uses this category. */
  fixedCategory?: Category
  submitLabel?: string
  variant?: 'full' | 'compact'
}

export function EntryForm({ fixedCategory, submitLabel = 'إرسال المشاركة 💗', variant = 'full' }: Props) {
  const [category, setCategory] = useState<Category>(fixedCategory ?? 'kind_word')
  const [message, setMessage] = useState('')
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')
  const [anonymous, setAnonymous] = useState(false)
  // Guards against double submits even before React re-renders the disabled button.
  const sendingRef = useRef(false)

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (sendingRef.current) return
    const form = new FormData(e.currentTarget)
    const participantType = String(form.get('participantType') ?? '')
    if (!participantType) {
      setError('فضلاً اختاري صفة المشارك.')
      setState('error')
      return
    }
    if (message.trim().length < 3) {
      setError('فضلاً اكتبي رسالة قصيرة على الأقل.')
      setState('error')
      return
    }
    sendingRef.current = true
    setState('sending')
    setError('')

    const name = anonymous ? '' : String(form.get('name') ?? '').trim()
    const recipient = category === 'gratitude' ? String(form.get('recipient') ?? '').trim() : ''
    const botField = String(form.get('bot-field') ?? '')
    const now = new Date()

    try {
      // Netlify Forms keeps the submission and shows it under Forms → athar-tayeb in the dashboard.
      // Labels are sent in Arabic so the dashboard entries are readable as-is.
      const res = await fetch(NETLIFY_FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': NETLIFY_FORM_NAME,
          'bot-field': botField,
          name: name || 'بدون اسم',
          anonymous: anonymous || !name ? 'نعم' : 'لا',
          participantType: PARTICIPANT_TYPES[participantType as keyof typeof PARTICIPANT_TYPES] ?? participantType,
          category: CATEGORIES[category],
          recipient,
          message: message.trim(),
          submittedAt: `${now.toLocaleString('ar-SA', { dateStyle: 'full', timeStyle: 'short' })} (${now.toISOString()})`,
        }).toString(),
      })
      if (!res.ok) throw new Error(`Netlify Forms responded with ${res.status}`)

      // Also queue it for moderation so approved messages can appear on the public walls.
      // The Netlify Forms copy is already saved, so a failure here shouldn't block the visitor.
      await submitEntry({
        data: { name, participantType, category, recipient, message, website: botField },
      }).catch((err) => console.error('Failed to queue submission for moderation', err))

      setState('done')
      setMessage('')
      setAnonymous(false)
    } catch (err) {
      console.error(err)
      setError('تعذّر إرسال مشاركتك الآن. فضلاً تحققي من اتصالك بالإنترنت ثم حاولي مرة أخرى 💗')
      setState('error')
    } finally {
      sendingRef.current = false
    }
  }

  if (state === 'done') {
    return (
      <div className="flex flex-col items-center rounded-3xl bg-sage-light/70 p-8 text-center ring-1 ring-sage/50" role="status">
        <CheckCircle2 className="h-12 w-12 text-moss" />
        <p className="mt-3 font-display text-2xl font-bold text-plum">وصل أثرك الطيب بنجاح، شكرًا لمشاركتك 💗</p>
        <p className="mt-2 max-w-md text-ink/80">
          ستراجع إدارة المبادرة مشاركتك قبل نشرها. بعض المشاركات مثل الأفكار والاقتراحات تصل للإدارة فقط ولا تُنشر.
        </p>
        <button
          type="button"
          onClick={() => setState('idle')}
          className="mt-5 rounded-full bg-ivory px-5 py-2 text-sm font-medium text-rosewood ring-1 ring-rose/50 transition hover:bg-blush/50"
        >
          إرسال مشاركة أخرى
        </button>
      </div>
    )
  }

  const compact = variant === 'compact'
  const isGratitude = category === 'gratitude'

  return (
    <form
      name={NETLIFY_FORM_NAME}
      method="POST"
      action={NETLIFY_FORM_ENDPOINT}
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={onSubmit}
      className="grid gap-4"
    >
      <input type="hidden" name="form-name" value={NETLIFY_FORM_NAME} />
      <input type="hidden" name="category" value={category} />
      {/* Honeypot */}
      <p className="hidden" aria-hidden="true">
        <label>
          لا تملئي هذا الحقل: <input type="text" name="bot-field" tabIndex={-1} autoComplete="off" />
        </label>
      </p>

      <div className={`grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <div className="grid gap-1.5">
          <label className="grid gap-1.5">
            <span className="text-sm font-medium text-plum">
              الاسم <span className="font-normal text-ink/60">(اختياري — الاسم الأول فقط)</span>
            </span>
            <input
              name="name"
              maxLength={NAME_MAX}
              className="field disabled:opacity-60"
              placeholder={anonymous ? 'مشاركة دون ذكر الاسم' : 'يمكنك تركه فارغًا'}
              autoComplete="off"
              disabled={anonymous}
            />
          </label>
          <label className="flex w-fit cursor-pointer items-center gap-2 text-xs text-ink/70">
            <input
              type="checkbox"
              name="anonymous"
              checked={anonymous}
              onChange={(e) => setAnonymous(e.target.checked)}
              className="h-4 w-4 accent-rosewood"
            />
            مشاركة دون ذكر الاسم
          </label>
        </div>
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-plum">
            صفة المشارك <span className="text-rosewood">*</span>
          </span>
          <select name="participantType" required className="field" defaultValue="">
            <option value="" disabled>
              اختاري…
            </option>
            {Object.entries(PARTICIPANT_TYPES).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </label>
      </div>

      {!fixedCategory && (
        <fieldset className="grid gap-2">
          <legend className="mb-1.5 text-sm font-medium text-plum">
            نوع المشاركة <span className="text-rosewood">*</span>
          </legend>
          <div className="flex flex-wrap gap-2">
            {Object.entries(CATEGORIES).map(([k, v]) => (
              <button
                type="button"
                key={k}
                onClick={() => setCategory(k as Category)}
                aria-pressed={category === k}
                className={`rounded-full px-4 py-2 text-sm transition ${
                  category === k ? 'bg-rosewood text-white shadow-md shadow-rose/40' : 'bg-ivory text-ink/80 ring-1 ring-beige hover:ring-rose'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {isGratitude && (
        <label className="grid gap-1.5">
          <span className="text-sm font-medium text-plum">
            إلى من تُهدين شكرك؟ <span className="font-normal text-ink/60">(اختياري)</span>
          </span>
          <input name="recipient" maxLength={NAME_MAX} className="field" placeholder="مثال: معلمتي، صديقاتي، أمي، حارس المدرسة…" autoComplete="off" />
        </label>
      )}

      <label className="grid gap-1.5">
        <span className="flex items-center justify-between text-sm font-medium text-plum">
          <span>
            رسالتك <span className="text-rosewood">*</span>
          </span>
          <span className="text-xs font-normal text-ink/50">
            {message.length}/{MESSAGE_MAX}
          </span>
        </span>
        <textarea
          name="message"
          required
          minLength={3}
          maxLength={MESSAGE_MAX}
          rows={compact ? 4 : 5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="field resize-y"
          placeholder={
            isGratitude
              ? 'شكرًا لأنكِ…'
              : category === 'activity_idea'
                ? 'اكتبي فكرة نشاط يُسعد الطالبات ويعزز اللطف…'
                : category === 'suggestion'
                  ? 'اكتبي اقتراحك لجعل مدرستنا أكثر لطفًا وأمانًا…'
                  : 'اكتبي كلمة طيبة تُسعد من يقرؤها…'
          }
        />
      </label>

      <p className="rounded-2xl bg-beige/50 px-4 py-2.5 text-xs leading-6 text-ink/70">
        🔒 لا تكتبي معلومات شخصية أو صحية (مثل رقم الجوال أو العنوان أو تفاصيل مرض). تُراجع كل المشاركات من الإدارة قبل نشرها.
      </p>

      {state === 'error' && (
        <p className="rounded-2xl bg-blush/60 px-4 py-2.5 text-sm text-plum" role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'sending'}
        aria-busy={state === 'sending'}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-rosewood px-7 py-3 font-medium text-white shadow-lg shadow-rose/40 transition hover:-translate-y-0.5 hover:bg-plum disabled:opacity-70"
      >
        {state === 'sending' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 -scale-x-100" />}
        {state === 'sending' ? 'جارٍ الإرسال…' : submitLabel}
      </button>
    </form>
  )
}
