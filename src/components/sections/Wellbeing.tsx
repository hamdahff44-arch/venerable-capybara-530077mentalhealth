import { useEffect, useState } from 'react'
import { Pause, Play, RotateCw } from 'lucide-react'
import { SectionTitle } from '../Decor'

const feelings = [
  { emoji: '😊', name: 'سعيدة', tip: 'جميل! شاركي فرحك مع صديقتك، واكتبي في دفترك ما الذي أسعدك اليوم لتتذكريه دائمًا.' },
  { emoji: '😟', name: 'قلقة', tip: 'خذي نفسًا عميقًا ببطء. ذكّري نفسك: «أنا بخير الآن، وأستطيع أن أتعامل مع هذا خطوة بخطوة». وتحدثي مع شخص تثقين به.' },
  { emoji: '😠', name: 'غاضبة', tip: 'توقفي لحظة قبل أن تتكلمي. عدّي من ١ إلى ١٠ ببطء، أو ابتعدي قليلًا واشربي ماءً. الغضب شعور طبيعي، والمهم كيف نتصرف.' },
  { emoji: '😢', name: 'حزينة', tip: 'لا بأس أن تحزني. عبّري عن شعورك بالكلام أو الرسم، واطلبي حضنًا أو حديثًا من شخص بالغ تثقين به.' },
  { emoji: '😴', name: 'متعبة', tip: 'جسمك يحتاج إلى راحة. حاولي النوم مبكرًا، واشربي الماء، وتحركي قليلًا في الهواء الطلق.' },
  { emoji: '🤩', name: 'متحمسة', tip: 'رائع! استثمري حماسك في هدف صغير اليوم، وشجعي صديقة تحتاج إلى طاقتك الجميلة.' },
]

const tips = [
  { icon: '🌸', title: 'سمّي شعورك', text: 'قولي لنفسك: «أنا أشعر بـ…». تسمية الشعور تجعله أوضح وأسهل في التعامل معه.' },
  { icon: '🧘‍♀️', title: 'الاسترخاء', text: 'أرخي كتفيك، وافتحي يديك، وأغمضي عينيك قليلًا. تخيلي مكانًا هادئًا تحبينه.' },
  { icon: '📝', title: 'الامتنان', text: 'اكتبي كل يوم ثلاثة أشياء تشعرين بالامتنان لها، مهما كانت صغيرة.' },
  { icon: '🤝', title: 'اطلبي الدعم', text: 'تحدثي مع شخص بالغ تثقين به: أمك، أبيك، معلمتك، أو الموجهة الطلابية. طلب المساعدة قوة وليس ضعفًا.' },
  { icon: '🚶‍♀️', title: 'حرّكي جسدك', text: 'المشي واللعب والحركة تُحسّن المزاج وتخفف التوتر.' },
  { icon: '💧', title: 'اعتني بنفسك', text: 'النوم الكافي، والماء، والطعام الصحي أصدقاء مزاجك الجيد.' },
]

const selfTalk = [
  { from: 'لا أستطيع فعل ذلك.', to: 'لا أستطيع بعد… لكني أتعلم كل يوم.' },
  { from: 'أخطأت، أنا فاشلة.', to: 'الخطأ جزء من التعلم، وسأحاول مرة أخرى.' },
  { from: 'لا أحد يحبني.', to: 'أنا أستحق الحب، وهناك من يهتم بي.' },
  { from: 'هذا صعب جدًا.', to: 'سأبدأ بخطوة صغيرة، ثم الخطوة التي تليها.' },
  { from: 'الأخريات أفضل مني.', to: 'لكلٍّ منا مواهبها، وأنا أنمو بطريقتي.' },
  { from: 'أنا خائفة.', to: 'من الطبيعي أن أخاف، وأنا أشجع مما أظن.' },
]

const PHASES = ['شهيق… ٤ ثوانٍ', 'احبسي النفس… ٤ ثوانٍ', 'زفير… ٤ ثوانٍ'] as const

function Breathing() {
  const [running, setRunning] = useState(false)
  const [phase, setPhase] = useState(0)
  const [cycles, setCycles] = useState(0)
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (!running) return
    const t = setInterval(() => {
      setPhase((p) => {
        if (p === 2) setCycles((c) => c + 1)
        return (p + 1) % 3
      })
    }, 4000)
    return () => clearInterval(t)
  }, [running])

  const start = () => {
    setPhase(0)
    setCycles(0)
    setKey((k) => k + 1)
    setRunning(true)
  }

  return (
    <div className="reveal flex flex-col items-center rounded-[2rem] bg-gradient-to-b from-sage-light to-ivory p-8 text-center ring-1 ring-sage/40">
      <h3 className="font-display text-2xl font-bold text-plum">تمرين التنفس الهادئ</h3>
      <p className="mt-1 text-ink/70">تابعي الدائرة: تكبر مع الشهيق، تثبت، ثم تصغر مع الزفير.</p>
      <div className="relative my-8 grid h-56 w-56 place-items-center">
        <div className="absolute inset-0 rounded-full bg-sage/20" />
        <div
          key={key}
          className={`absolute inset-3 rounded-full bg-gradient-to-br from-blush via-rose/70 to-sage/70 shadow-xl shadow-rose/30 ${
            running ? 'animate-breathe' : 'scale-[0.62]'
          }`}
        />
        <span className="relative font-display text-xl font-semibold text-plum" aria-live="polite">
          {running ? PHASES[phase] : 'مستعدة؟'}
        </span>
      </div>
      <div className="flex gap-3">
        {running ? (
          <button onClick={() => setRunning(false)} className="inline-flex items-center gap-2 rounded-full bg-ivory px-5 py-2.5 text-plum ring-1 ring-beige">
            <Pause className="h-4 w-4" /> إيقاف
          </button>
        ) : (
          <button onClick={start} className="inline-flex items-center gap-2 rounded-full bg-moss px-6 py-2.5 text-white shadow-md transition hover:-translate-y-0.5">
            {cycles > 0 ? <RotateCw className="h-4 w-4" /> : <Play className="h-4 w-4 -scale-x-100" />}
            {cycles > 0 ? 'من جديد' : 'ابدئي التمرين'}
          </button>
        )}
      </div>
      <p className="mt-4 text-sm text-moss">{cycles > 0 ? `أكملتِ ${cycles} ${cycles === 1 ? 'دورة' : 'دورات'} 🌿 أحسنتِ!` : 'جرّبي ٥ دورات لتشعري بالهدوء.'}</p>
    </div>
  )
}

function FeelingCheckIn() {
  const [selected, setSelected] = useState<number | null>(null)
  return (
    <div className="reveal rounded-[2rem] bg-ivory p-8 ring-1 ring-beige">
      <h3 className="font-display text-2xl font-bold text-plum">كيف تشعرين اليوم؟</h3>
      <p className="mt-1 text-ink/70">اختاري الوجه الأقرب لشعورك، وإليكِ نصيحة لطيفة.</p>
      <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
        {feelings.map((f, i) => (
          <button
            key={f.name}
            onClick={() => setSelected(i)}
            aria-pressed={selected === i}
            className={`flex flex-col items-center gap-1 rounded-2xl p-3 transition ${
              selected === i ? 'bg-blush ring-2 ring-rose' : 'bg-cream ring-1 ring-beige hover:-translate-y-0.5 hover:bg-blush/40'
            }`}
          >
            <span className="text-3xl">{f.emoji}</span>
            <span className="text-sm text-plum">{f.name}</span>
          </button>
        ))}
      </div>
      <div className="mt-5 min-h-24 rounded-2xl bg-cream p-5 text-ink/85" aria-live="polite">
        {selected === null ? (
          <span className="text-ink/50">كل المشاعر مقبولة، والمهم أن نفهمها ونعتني بأنفسنا.</span>
        ) : (
          <p>
            <span className="ml-1 text-xl">{feelings[selected].emoji}</span>
            {feelings[selected].tip}
          </p>
        )}
      </div>
    </div>
  )
}

function SelfTalkCard({ from, to }: { from: string; to: string }) {
  const [flipped, setFlipped] = useState(false)
  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className={`reveal min-h-36 rounded-3xl p-5 text-right transition-all duration-500 ${
        flipped ? 'bg-sage-light ring-1 ring-sage' : 'bg-ivory ring-1 ring-beige hover:-translate-y-1 hover:shadow-md'
      }`}
      aria-label={flipped ? to : `${from} — اضغطي لرؤية العبارة الإيجابية`}
    >
      {flipped ? (
        <>
          <span className="text-xs font-medium text-moss">قولي لنفسك بدلًا من ذلك 🌿</span>
          <p className="mt-2 font-display text-lg font-semibold text-plum">«{to}»</p>
        </>
      ) : (
        <>
          <span className="text-xs text-ink/50">بدلًا من أن تقولي…</span>
          <p className="mt-2 text-lg text-ink/70 line-through decoration-rose/60">«{from}»</p>
          <span className="mt-3 inline-block text-xs text-rosewood">اضغطي للقلب ↺</span>
        </>
      )}
    </button>
  )
}

export function Wellbeing() {
  return (
    <section id="wellbeing" className="paper px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="ركن الصحة النفسية" title="أدوات صغيرة لقلبٍ مطمئن">
          نصائح عملية تساعدك على فهم مشاعرك، والهدوء عند التوتر، والحديث مع نفسك بلطف.
        </SectionTitle>

        <div className="grid gap-6 lg:grid-cols-2">
          <Breathing />
          <FeelingCheckIn />
        </div>

        <h3 className="reveal mt-16 text-center font-display text-2xl font-bold text-plum">نصائح لإدارة المشاعر</h3>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tips.map((t, i) => (
            <div key={t.title} className="reveal rounded-3xl bg-ivory/90 p-6 ring-1 ring-beige" style={{ transitionDelay: `${i * 60}ms` }}>
              <span className="text-3xl">{t.icon}</span>
              <h4 className="mt-2 font-display text-lg font-bold text-plum">{t.title}</h4>
              <p className="mt-1 text-ink/75">{t.text}</p>
            </div>
          ))}
        </div>

        <h3 className="reveal mt-16 text-center font-display text-2xl font-bold text-plum">الحديث الإيجابي مع النفس</h3>
        <p className="reveal mt-1 text-center text-ink/70">اضغطي على كل بطاقة لتحويل الفكرة السلبية إلى عبارة لطيفة.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {selfTalk.map((s) => (
            <SelfTalkCard key={s.from} {...s} />
          ))}
        </div>

        <div className="reveal mx-auto mt-14 max-w-3xl rounded-[2rem] bg-plum p-8 text-center text-cream shadow-xl">
          <p className="font-display text-2xl font-bold">لستِ وحدكِ 💗</p>
          <p className="mt-2 text-cream/85">
            إذا شعرتِ بالحزن أو الخوف لفترة طويلة، أو أزعجك شيء ما، تحدثي مع أحد الكبار الذين تثقين بهم: والديك، معلمتك، أو
            الموجهة الطلابية في المدرسة. هم هنا للاستماع إليك ومساعدتك.
          </p>
        </div>
      </div>
    </section>
  )
}
