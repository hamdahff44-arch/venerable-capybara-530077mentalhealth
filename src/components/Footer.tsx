import { Heart, Sprig } from './Decor'
import { NAV } from './Header'

export function Footer() {
  return (
    <footer className="relative mt-10 overflow-hidden bg-plum text-cream">
      <div className="mx-auto max-w-6xl px-6 py-14 text-center">
        <Sprig className="mx-auto h-8 w-36 opacity-90" />
        <p className="mt-4 font-display text-3xl font-bold">ابتدائية الفويلق</p>
        <p className="mt-2 text-cream/80">مبادرة «أثر طيب لصحة نفسية أفضل» — معًا نصنع بيئة مدرسية أكثر لطفًا وأمانًا</p>
        <ul className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-cream/75">
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={`/${n.href}`} className="hover:text-blush">
                {n.label}
              </a>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-10 max-w-md text-sm text-cream/80">إعداد وتنفيذ: حمده فايز — مسؤولة التوجيه الطلابي، ابتدائية الفويلق</p>
        <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 border-t border-cream/15 pt-6 text-xs text-cream/60">
          <span>صُنع بحب لطالباتنا</span>
          <Heart className="h-3.5 w-3.5 text-rose" />
          <span>·</span>
          <a href="/admin" className="underline-offset-4 hover:text-blush hover:underline">
            دخول الإدارة
          </a>
        </div>
      </div>
    </footer>
  )
}
