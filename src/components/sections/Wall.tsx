import { useMemo, useState } from 'react'
import { Shuffle } from 'lucide-react'
import { Heart, SectionTitle } from '../Decor'
import type { PublicEntry } from '../../lib/submissions'
import { CATEGORIES, PARTICIPANT_TYPES, WALL_CATEGORIES } from '../../lib/options'
import { byline, useHearts } from './shared'

const NOTE_STYLES = [
  'bg-blush/80 [--r:-2deg]',
  'bg-sage-light [--r:1.5deg]',
  'bg-[#fbeedd] [--r:-1deg]',
  'bg-[#f9e4ea] [--r:2deg]',
  'bg-ivory [--r:-1.5deg]',
  'bg-[#eef3ea] [--r:1deg]',
]

const STARTERS = [
  'ابتسامتك تجعل يوم من حولك أجمل.',
  'أنتِ أقوى مما تظنين، وأجمل مما تتخيلين.',
  'كلمة طيبة منكِ قد تغيّر يوم صديقتك.',
  'كل خطوة صغيرة نحو الأفضل تستحق الاحتفال.',
]

export function Wall({ entries }: { entries: PublicEntry[] }) {
  const [filter, setFilter] = useState<'all' | string>('all')
  const [highlight, setHighlight] = useState<number | null>(null)
  const { counts, given, give } = useHearts(entries)

  const shown = useMemo(() => (filter === 'all' ? entries : entries.filter((e) => e.category === filter)), [entries, filter])

  function surprise() {
    if (!shown.length) return
    const pick = shown[Math.floor(Math.random() * shown.length)]
    setHighlight(pick.id)
    document.getElementById(`note-${pick.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    setTimeout(() => setHighlight(null), 2600)
  }

  return (
    <section id="wall" className="relative overflow-hidden px-4 py-24 sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(239_227_211/0.6)_1px,transparent_1px)] [background-size:22px_22px]" />
      <div className="relative mx-auto max-w-6xl">
        <SectionTitle eyebrow="جدار الأثر الطيب" title="كلمات تُزهر في القلوب">
          كلمات طيبة ورسائل تشجيع وامتنان وأفكار أنشطة واقتراحات من طالباتنا ومعلماتنا، تُنشر تلقائيًا وفورًا دون انتظار موافقة الإدارة.
        </SectionTitle>

        <div className="reveal mb-8 flex flex-wrap items-center justify-center gap-2">
          {[['all', 'الكل'] as const, ...WALL_CATEGORIES.map((c) => [c, CATEGORIES[c]] as const)].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              aria-pressed={filter === k}
              className={`rounded-full px-4 py-1.5 text-sm transition ${filter === k ? 'bg-plum text-cream' : 'bg-ivory text-ink/75 ring-1 ring-beige hover:ring-rose'}`}
            >
              {label}
            </button>
          ))}
          {shown.length > 1 && (
            <button onClick={surprise} className="inline-flex items-center gap-1.5 rounded-full bg-rosewood px-4 py-1.5 text-sm text-white transition hover:bg-plum">
              <Shuffle className="h-3.5 w-3.5" /> كلمة عشوائية لكِ
            </button>
          )}
        </div>

        {shown.length === 0 ? (
          <div className="reveal mx-auto max-w-3xl rounded-[2rem] bg-ivory/90 p-8 text-center ring-1 ring-beige">
            <p className="font-display text-xl font-bold text-plum">الجدار ينتظر كلماتكم الأولى 🌱</p>
            <p className="mt-2 text-ink/70">
              لا توجد مشاركات في هذا التصنيف بعد. شاركي ليُنشر أثرك تلقائيًا وفورًا! هذه عبارات من المبادرة لتلهمك:
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {STARTERS.map((s, i) => (
                <p key={s} className={`rounded-2xl p-4 font-hand text-xl text-plum ${NOTE_STYLES[i]}`}>
                  {s}
                </p>
              ))}
            </div>
            <a href="#participate" className="mt-6 inline-block rounded-full bg-rosewood px-6 py-2.5 text-white transition hover:bg-plum">
              أضيفي كلمتك
            </a>
          </div>
        ) : (
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3">
            {shown.map((e, i) => {
              const hearted = given.includes(e.id)
              return (
                <article
                  id={`note-${e.id}`}
                  key={e.id}
                  className={`reveal mb-5 break-inside-avoid rounded-3xl p-6 shadow-[0_10px_30px_-18px_rgba(111,59,71,0.45)] transition-all duration-500 ${NOTE_STYLES[i % NOTE_STYLES.length]} ${
                    highlight === e.id ? 'scale-105 ring-4 ring-rose' : 'rotate-[var(--r)] hover:rotate-0'
                  }`}
                >
                  <span className="text-xs font-medium text-rosewood/90">{CATEGORIES[e.category as keyof typeof CATEGORIES]}</span>
                  <p className="mt-2 whitespace-pre-line text-lg leading-8 text-ink">{e.message}</p>
                  <footer className="mt-4 flex items-center justify-between gap-3 text-sm">
                    <span className="text-ink/60">{byline(e, PARTICIPANT_TYPES)}</span>
                    <button
                      onClick={() => give(e.id)}
                      disabled={hearted}
                      aria-label="أرسلي قلبًا لهذه الرسالة"
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 transition ${
                        hearted ? 'bg-rosewood text-white' : 'bg-ivory/80 text-rosewood hover:scale-110'
                      }`}
                    >
                      <Heart className="h-4 w-4" filled={hearted} />
                      <span className="tabular-nums">{counts[e.id] ?? 0}</span>
                    </button>
                  </footer>
                </article>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
