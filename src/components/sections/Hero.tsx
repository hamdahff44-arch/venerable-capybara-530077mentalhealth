import { ArrowDown } from 'lucide-react'
import { Heart, img } from '../Decor'

const floating = [
  { cls: 'top-[18%] right-[12%] h-5 w-5 text-rose', d: '0s' },
  { cls: 'top-[30%] left-[16%] h-4 w-4 text-rose/70', d: '1.2s' },
  { cls: 'bottom-[26%] right-[22%] h-3 w-3 text-sage', d: '2.1s' },
  { cls: 'bottom-[20%] left-[24%] h-6 w-6 text-blush', d: '0.6s' },
]

export function Hero() {
  return (
    <section id="home" className="relative -mt-[68px] overflow-hidden pt-[68px]">
      <img
        src={img('hero.png', 1800)}
        srcSet={`${img('hero.png', 900)} 900w, ${img('hero.png', 1800)} 1800w`}
        sizes="100vw"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover object-center opacity-90 max-md:opacity-50"
        fetchPriority="high"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-cream/10 via-cream/30 to-cream" />
      {floating.map((f, i) => (
        <Heart key={i} className={`absolute animate-float ${f.cls}`} />
      ))}

      <div className="relative mx-auto flex min-h-[88vh] max-w-3xl flex-col items-center justify-center px-6 py-20 text-center">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-ivory/80 px-4 py-1.5 text-sm text-moss ring-1 ring-sage/40 backdrop-blur">
          ابتدائية الفويلق · مبادرة الصحة النفسية
        </p>
        <h1 className="font-display text-4xl font-bold leading-[1.35] text-plum sm:text-6xl sm:leading-[1.3]">
          أثر طيب
          <span className="block text-rosewood">لصحة نفسية أفضل 💗</span>
        </h1>
        <p className="mt-5 font-hand text-2xl text-moss sm:text-3xl">معًا نصنع بيئة مدرسية أكثر لطفًا وأمانًا</p>
        <p className="mt-6 max-w-xl text-lg text-ink/80">
          مبادرة تحتفي بالكلمة الطيبة، وتساعد طالباتنا على فهم مشاعرهن والتعبير عنها، وتجمع الطالبات والمعلمات وأولياء
          الأمور حول قيمة واحدة: أن يترك كلٌّ منا أثرًا طيبًا في قلب من حوله.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <a
            href="#participate"
            className="rounded-full bg-rosewood px-7 py-3 font-medium text-white shadow-lg shadow-rose/50 transition hover:-translate-y-0.5 hover:bg-plum"
          >
            شاركي بأثرك الطيب
          </a>
          <a
            href="#wall"
            className="rounded-full bg-ivory/90 px-7 py-3 font-medium text-plum ring-1 ring-rose/50 backdrop-blur transition hover:-translate-y-0.5 hover:bg-blush/60"
          >
            زوري جدار الأثر الطيب
          </a>
        </div>
        <a href="#about" className="mt-14 text-moss/80 transition hover:text-rosewood" aria-label="انتقلي إلى عن المبادرة">
          <ArrowDown className="h-6 w-6 animate-bounce" />
        </a>
      </div>
    </section>
  )
}
