import { HeartHandshake, MessageCircleHeart, School, Sparkles, Smile } from 'lucide-react'
import { SectionTitle, img } from '../Decor'

const pillars = [
  { icon: Smile, title: 'الرفاه العاطفي', text: 'حين تشعر الطالبة بالطمأنينة تتعلم بحب، وتبني صداقات صحية، وتواجه التحديات بثقة.', tone: 'bg-blush/60 text-rosewood' },
  { icon: HeartHandshake, title: 'اللطف', text: 'الكلمة الطيبة صدقة، والابتسامة لغة يفهمها الجميع. اللطف عادة صغيرة تصنع فرقًا كبيرًا.', tone: 'bg-sage-light text-moss' },
  { icon: MessageCircleHeart, title: 'التواصل الإيجابي', text: 'نتعلم أن نُصغي باهتمام، ونعبّر عن رأينا بهدوء واحترام، ونختار كلماتنا بعناية.', tone: 'bg-beige/80 text-plum' },
  { icon: Sparkles, title: 'الوعي بالذات', text: 'أن تعرف الطالبة مشاعرها وتسمّيها هو أول خطوة لفهمها وإدارتها بطريقة صحية.', tone: 'bg-blush/60 text-rosewood' },
  { icon: School, title: 'بيئة مدرسية داعمة', text: 'مدرسة يشعر فيها الجميع بالأمان والانتماء، وتعرف فيها كل طالبة أن هناك من يستمع إليها.', tone: 'bg-sage-light text-moss' },
]

export function About() {
  return (
    <section id="about" className="relative px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="عن المبادرة" title="لماذا «أثر طيب»؟">
          لأن الصحة النفسية جزء أصيل من صحة طالباتنا ونجاحهن، ولأن البيئة المدرسية اللطيفة تبدأ بتفاصيل صغيرة نصنعها معًا كل يوم.
        </SectionTitle>

        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.2fr]">
          <figure className="reveal relative mx-auto w-full max-w-md">
            <div className="absolute -inset-3 rotate-3 rounded-[2.5rem] bg-blush/60" />
            <img
              src={img('children.png', 800)}
              alt="رسم مائي لطالبتين تزرعان زهرة على شكل قلب في حديقة المدرسة"
              loading="lazy"
              width={800}
              height={800}
              className="relative aspect-square w-full rounded-[2.2rem] object-cover shadow-xl shadow-plum/10"
            />
            <figcaption className="relative -mt-8 mr-6 inline-block rounded-2xl bg-ivory px-5 py-3 font-hand text-xl text-plum shadow-lg">
              نزرع اللطف… فيُزهر أمانًا
            </figcaption>
          </figure>

          <div className="grid gap-4 sm:grid-cols-2">
            {pillars.map((p, i) => (
              <article
                key={p.title}
                className={`reveal group rounded-3xl bg-ivory p-6 shadow-sm ring-1 ring-beige transition hover:-translate-y-1 hover:shadow-lg hover:shadow-rose/20 ${
                  i === pillars.length - 1 ? 'sm:col-span-2' : ''
                }`}
                style={{ transitionDelay: `${i * 70}ms` }}
              >
                <span className={`grid h-12 w-12 place-items-center rounded-2xl ${p.tone}`}>
                  <p.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-display text-xl font-bold text-plum">{p.title}</h3>
                <p className="mt-1.5 text-ink/75">{p.text}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
