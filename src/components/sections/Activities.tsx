import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'
import { SectionTitle } from '../Decor'

const groups = [
  {
    title: 'أنشطة الصحة النفسية',
    tone: 'bg-sage-light text-moss',
    emoji: '🌿',
    items: ['دقيقة هدوء صباحية قبل الحصة الأولى', 'ركن «كيف أشعر اليوم؟» في كل فصل', 'رسم المشاعر بالألوان المائية', 'جلسة تنفس واسترخاء جماعية'],
  },
  {
    title: 'تحديات اللطف',
    tone: 'bg-blush/70 text-rosewood',
    emoji: '💗',
    items: ['صندوق الرسائل السرية الطيبة بين الطالبات', 'تحدي «امدحي ثلاث صديقات اليوم»', 'صديقة الفسحة: نرحب بمن تجلس وحدها', 'بطاقات شكر لعاملات المدرسة'],
  },
  {
    title: 'أنشطة الامتنان',
    tone: 'bg-beige text-plum',
    emoji: '📔',
    items: ['دفتر الامتنان اليومي: ثلاثة أشياء جميلة', 'شجرة الامتنان: ورقة شكر على كل غصن', 'رسالة شكر للأسرة في نهاية الأسبوع', 'لوحة «أنا ممتنة لـ…» في الممر'],
  },
  {
    title: 'حملات مدرسية',
    tone: 'bg-[#f9e4ea] text-plum',
    emoji: '📣',
    items: ['أسبوع الكلمة الطيبة', 'حملة «مدرستي آمنة» ضد التنمر', 'يوم الابتسامة', 'معرض أعمال الطالبات عن المشاعر'],
  },
]

const CHALLENGE = [
  'ابتسمي لكل من تقابلينها اليوم',
  'قولي «شكرًا» لثلاثة أشخاص',
  'اكتبي رسالة لطيفة لصديقتك',
  'ساعدي زميلتك دون أن تطلب',
  'اكتبي ثلاثة أشياء تحبينها في نفسك',
  'ادعي لصديقة غائبة وتفقدي حالها',
  'شاركي كلمة طيبة على جدار الأثر',
]

const KEY = 'athar-kindness-challenge'

function KindnessChallenge() {
  const [done, setDone] = useState<boolean[]>(() => CHALLENGE.map(() => false))

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? 'null')
      if (Array.isArray(saved) && saved.length === CHALLENGE.length) setDone(saved)
    } catch {
      // ignore
    }
  }, [])

  function toggle(i: number) {
    setDone((d) => {
      const next = d.map((v, j) => (j === i ? !v : v))
      localStorage.setItem(KEY, JSON.stringify(next))
      return next
    })
  }

  const count = done.filter(Boolean).length
  const pct = Math.round((count / CHALLENGE.length) * 100)

  return (
    <div className="reveal rounded-[2rem] bg-plum p-6 text-cream shadow-xl sm:p-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="text-sm text-blush">تحدٍّ تفاعلي</span>
          <h3 className="font-display text-2xl font-bold sm:text-3xl">تحدي اللطف في ٧ أيام</h3>
          <p className="mt-1 text-cream/75">مهمة لطيفة لكل يوم. علّمي على ما أنجزتِه — يُحفظ تقدمك على جهازك.</p>
        </div>
        <div className="text-left">
          <span className="font-display text-4xl font-bold text-blush">{count}/٧</span>
        </div>
      </div>
      <div className="mt-5 h-3 overflow-hidden rounded-full bg-cream/15" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-gradient-to-l from-rose to-sage transition-all duration-700" style={{ width: `${pct}%` }} />
      </div>
      <ol className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {CHALLENGE.map((task, i) => (
          <li key={task}>
            <button
              onClick={() => toggle(i)}
              aria-pressed={done[i]}
              className={`flex w-full items-center gap-3 rounded-2xl p-4 text-right transition ${done[i] ? 'bg-sage/30' : 'bg-cream/10 hover:bg-cream/15'}`}
            >
              <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full text-sm ${done[i] ? 'bg-sage text-plum' : 'ring-1 ring-cream/40'}`}>
                {done[i] ? <Check className="h-4 w-4" /> : (i + 1).toLocaleString('ar-SA')}
              </span>
              <span className={done[i] ? 'text-cream/70 line-through' : ''}>
                <span className="block text-xs text-blush/80">اليوم {(i + 1).toLocaleString('ar-SA')}</span>
                {task}
              </span>
            </button>
          </li>
        ))}
      </ol>
      {count === CHALLENGE.length && (
        <p className="mt-6 rounded-2xl bg-blush/20 p-4 text-center font-display text-xl" role="status">
          🎉 أحسنتِ! أكملتِ التحدي وتركتِ أثرًا طيبًا في سبعة أيام 💗
        </p>
      )}
    </div>
  )
}

export function Activities() {
  return (
    <section id="activities" className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="الأنشطة المدرسية" title="أفكار نعيشها معًا">
          مجموعة من الأفكار والأنشطة التي يمكن تطبيقها في الفصول والفسحة والطابور الصباحي.
        </SectionTitle>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {groups.map((g, i) => (
            <article key={g.title} className="reveal rounded-3xl bg-ivory p-6 ring-1 ring-beige transition hover:-translate-y-1 hover:shadow-lg hover:shadow-rose/15" style={{ transitionDelay: `${i * 80}ms` }}>
              <span className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl ${g.tone}`}>{g.emoji}</span>
              <h3 className="mt-4 font-display text-xl font-bold text-plum">{g.title}</h3>
              <ul className="mt-3 grid gap-2">
                {g.items.map((item) => (
                  <li key={item} className="flex gap-2 text-ink/80">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rose" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="mt-10">
          <KindnessChallenge />
        </div>
        <p className="reveal mt-8 text-center text-ink/70">
          لديك فكرة نشاط؟{' '}
          <a href="#participate" className="font-medium text-rosewood underline decoration-rose/50 underline-offset-4 hover:text-plum">
            أرسليها لنا من نموذج «شاركي معنا»
          </a>
        </p>
      </div>
    </section>
  )
}
