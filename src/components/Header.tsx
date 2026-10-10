import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Heart } from './Decor'

export const NAV = [
  { href: '#home', label: 'الرئيسية' },
  { href: '#about', label: 'عن المبادرة' },
  { href: '#wellbeing', label: 'ركن الصحة النفسية' },
  { href: '#wall', label: 'جدار الأثر الطيب' },
  { href: '#gratitude', label: 'ركن الامتنان' },
  { href: '#activities', label: 'الأنشطة' },
  { href: '#privacy', label: 'الخصوصية' },
]

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [active, setActive] = useState('#home')

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12)
      let current = '#home'
      for (const item of [...NAV, { href: '#participate' }]) {
        const el = document.querySelector(item.href)
        if (el && el.getBoundingClientRect().top < 140) current = item.href
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-beige/80 bg-ivory/85 shadow-[0_6px_30px_-18px_rgba(111,59,71,0.35)] backdrop-blur-md' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a href="/#home" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-blush text-rosewood">
            <Heart className="h-5 w-5" />
          </span>
          <span className="leading-tight">
            <span className="block font-display text-lg font-bold text-plum">أثر طيب</span>
            <span className="block text-xs text-moss">لصحة نفسية أفضل</span>
          </span>
        </a>

        <ul className="hidden items-center gap-1 xl:flex">
          {NAV.map((item) => (
            <li key={item.href}>
              <a
                href={`/${item.href}`}
                className={`rounded-full px-3 py-1.5 text-[15px] transition-colors ${
                  active === item.href ? 'bg-blush/80 text-plum' : 'text-ink/75 hover:bg-beige/60 hover:text-plum'
                }`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <a
            href="/#participate"
            className="hidden rounded-full bg-rosewood px-5 py-2 text-sm font-medium text-white shadow-md shadow-rose/40 transition hover:-translate-y-0.5 hover:bg-plum sm:inline-block"
          >
            شاركي معنا 💗
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center rounded-full bg-ivory text-plum ring-1 ring-beige xl:hidden"
            aria-label={open ? 'إغلاق القائمة' : 'فتح القائمة'}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <div
        className={`overflow-hidden border-beige bg-ivory/95 backdrop-blur-md transition-[max-height] duration-500 xl:hidden ${
          open ? 'max-h-[32rem] border-b' : 'max-h-0'
        }`}
      >
        <ul className="grid gap-1 px-4 py-3 sm:grid-cols-2">
          {[...NAV, { href: '#participate', label: 'شاركي معنا 💗' }].map((item) => (
            <li key={item.href}>
              <a
                href={`/${item.href}`}
                onClick={() => setOpen(false)}
                className={`block rounded-2xl px-4 py-2.5 ${active === item.href ? 'bg-blush/70 text-plum' : 'text-ink/80 hover:bg-beige/50'}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </header>
  )
}
