import { School, UserRound } from 'lucide-react'
import { Heart, Sprig } from '../Decor'

export function Founder() {
  return (
    <section id="founder" aria-labelledby="founder-title" className="relative px-4 pb-24 sm:px-6">
      <div className="reveal relative mx-auto max-w-3xl">
        <div className="absolute -inset-2 -rotate-1 rounded-[2.6rem] bg-sage-light" aria-hidden="true" />
        <div className="relative overflow-hidden rounded-[2.4rem] bg-ivory px-6 py-12 text-center shadow-xl shadow-plum/10 ring-1 ring-beige sm:px-12">
          <Heart className="absolute -top-6 -start-6 h-24 w-24 text-blush/70" />
          <Heart className="absolute -bottom-8 -end-6 h-28 w-28 text-beige" />

          <span className="relative inline-flex items-center gap-2 rounded-full bg-blush/70 px-4 py-1 text-sm font-medium text-rosewood">
            <Heart className="h-3.5 w-3.5" /> صاحبة المبادرة
          </span>

          <div className="relative mx-auto mt-6 grid h-20 w-20 place-items-center rounded-full bg-blush text-rosewood ring-8 ring-blush/40">
            <UserRound className="h-9 w-9" />
          </div>

          <h2 id="founder-title" className="relative mt-5 font-display text-3xl font-bold text-plum sm:text-4xl">
            حمده فايز
          </h2>
          <p className="relative mt-2 text-lg font-medium text-moss">مسؤولة التوجيه الطلابي</p>
          <p className="relative mt-1 inline-flex items-center gap-1.5 text-ink/70">
            <School className="h-4 w-4" /> ابتدائية الفويلق
          </p>

          <Sprig className="relative mx-auto mt-6 h-6 w-28" />

          <blockquote className="relative mx-auto mt-5 max-w-xl font-hand text-2xl leading-relaxed text-rosewood sm:text-3xl">
            «معًا نصنع أثرًا طيبًا، ونبني بيئة مدرسية أكثر صحة نفسية وطمأنينة.»
          </blockquote>
        </div>
      </div>
    </section>
  )
}
