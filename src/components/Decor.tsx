import { useEffect, useRef, type ReactNode } from 'react'

export const img = (file: string, w: number) => `/.netlify/images?url=/img/${file}&w=${w}&fm=webp`

export function Heart({ className = '', filled = true }: { className?: string; filled?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        d="M12 21s-7.5-4.6-9.6-9.3C.9 8.3 2.9 4.5 6.6 4.5c2.2 0 3.6 1.2 5.4 3.3 1.8-2.1 3.2-3.3 5.4-3.3 3.7 0 5.7 3.8 4.2 7.2C19.5 16.4 12 21 12 21z"
        fill={filled ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.6}
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** A small hand-drawn floral sprig used as a divider and corner ornament. */
export function Sprig({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 40" aria-hidden="true" className={className} fill="none">
      <path d="M4 30 C 30 26, 60 18, 116 12" stroke="#a9bfa3" strokeWidth="1.6" strokeLinecap="round" />
      {[18, 38, 58, 78].map((x, i) => (
        <g key={x}>
          <ellipse cx={x} cy={26 - i * 3.6} rx="7" ry="3" transform={`rotate(-35 ${x} ${26 - i * 3.6})`} fill="#c9d8c4" />
          <ellipse cx={x + 8} cy={30 - i * 3.6} rx="6" ry="2.6" transform={`rotate(25 ${x + 8} ${30 - i * 3.6})`} fill="#a9bfa3" />
        </g>
      ))}
      <circle cx="104" cy="12" r="6" fill="#f6d9dc" />
      <circle cx="104" cy="12" r="2.4" fill="#e7a9b3" />
      <circle cx="92" cy="8" r="3" fill="#efe3d3" />
    </svg>
  )
}

export function SectionTitle({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <div className="reveal mx-auto mb-12 max-w-2xl text-center">
      <span className="inline-flex items-center gap-2 rounded-full bg-blush/70 px-4 py-1 text-sm font-medium text-rosewood">
        <Heart className="h-3.5 w-3.5" /> {eyebrow}
      </span>
      <h2 className="mt-4 font-display text-3xl font-bold text-plum sm:text-4xl">{title}</h2>
      <Sprig className="mx-auto mt-3 h-6 w-28" />
      {children && <p className="mt-4 text-lg text-ink/80">{children}</p>}
    </div>
  )
}

/** Adds `is-visible` to every `.reveal` element inside the wrapper as it scrolls into view. */
export function RevealOnScroll({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12 },
    )
    const observe = () => root.querySelectorAll('.reveal:not(.is-visible)').forEach((el) => io.observe(el))
    observe()
    const mo = new MutationObserver(observe)
    mo.observe(root, { childList: true, subtree: true })
    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])
  return <div ref={ref}>{children}</div>
}
