import { Lightbulb, MessageSquareHeart, PenLine } from 'lucide-react'
import { SectionTitle, img } from '../Decor'
import { EntryForm } from '../EntryForm'

const notes = [
  { icon: MessageSquareHeart, text: 'الكلمات الطيبة ورسائل التشجيع والامتنان تُنشر على الجدار بعد موافقة الإدارة.' },
  { icon: Lightbulb, text: 'أفكار الأنشطة والاقتراحات تصل إلى الإدارة فقط لدراستها، ولا تُنشر.' },
  { icon: PenLine, text: 'الاسم اختياري تمامًا، ويمكنك المشاركة دون ذكره.' },
]

export function Participate() {
  return (
    <section id="participate" className="relative overflow-hidden px-4 py-24 sm:px-6">
      <img
        src={img('hero.png', 1600)}
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-35"
      />
      <div className="relative mx-auto max-w-5xl">
        <SectionTitle eyebrow="شاركي معنا" title="اتركي أثرك الطيب">
          طالبات ومعلمات وأولياء أمور: شاركونا كلمة طيبة، أو فكرة نشاط، أو اقتراحًا يجعل مدرستنا أجمل.
        </SectionTitle>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div className="reveal rounded-[2rem] bg-ivory/95 p-6 shadow-xl shadow-plum/10 ring-1 ring-beige backdrop-blur sm:p-8">
            <EntryForm />
          </div>
          <aside className="reveal grid content-start gap-3">
            {notes.map((n) => (
              <div key={n.text} className="flex gap-3 rounded-3xl bg-ivory/90 p-5 ring-1 ring-beige backdrop-blur">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-sage-light text-moss">
                  <n.icon className="h-5 w-5" />
                </span>
                <p className="text-ink/80">{n.text}</p>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </section>
  )
}
