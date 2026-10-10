import { EyeOff, ShieldCheck, UserRoundCheck, Ban } from 'lucide-react'
import { SectionTitle } from '../Decor'

const points = [
  { icon: ShieldCheck, title: 'مراجعة قبل النشر', text: 'لا تُنشر أي مشاركة تلقائيًا. تراجع إدارة المبادرة كل رسالة أولًا، ولا يظهر على الموقع إلا ما تمت الموافقة عليه.' },
  { icon: Ban, title: 'لا معلومات حساسة', text: 'لا نطلب أرقام الهواتف أو العناوين أو أرقام الهوية أو أي معلومات صحية. فضلًا لا تكتبيها في رسائلك.' },
  { icon: EyeOff, title: 'الاسم اختياري', text: 'يمكنك المشاركة دون اسم. وإن رغبتِ بذكره فاكتبي الاسم الأول فقط.' },
  { icon: UserRoundCheck, title: 'مساحة آمنة ولطيفة', text: 'تُستبعد أي رسالة تحتوي على إساءة أو تنمر أو معلومات شخصية، حفاظًا على سلامة الجميع.' },
]

export function Privacy() {
  return (
    <section id="privacy" className="paper px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="الخصوصية والأمان" title="سلامتكِ أولًا">
          صُمم هذا الموقع ليكون مساحة آمنة. إليكِ كيف نحافظ على خصوصية مشاركاتكم.
        </SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
          {points.map((p, i) => (
            <div key={p.title} className="reveal flex gap-4 rounded-3xl bg-ivory p-6 ring-1 ring-beige" style={{ transitionDelay: `${i * 60}ms` }}>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-sage-light text-moss">
                <p.icon className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-plum">{p.title}</h3>
                <p className="mt-1 text-ink/75">{p.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal mt-10 rounded-[2rem] bg-ivory p-6 ring-1 ring-beige sm:p-8">
          <h3 className="font-display text-xl font-bold text-plum">رحلة المشاركة 💌</h3>
          <ol className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              ['١', 'ترسلين مشاركتك', 'تُحفظ بأمان في قاعدة بيانات الموقع بحالة «بانتظار المراجعة».'],
              ['٢', 'تراجعها الإدارة', 'من لوحة الإدارة المحمية بكلمة مرور، توافق أو تستبعد كل رسالة.'],
              ['٣', 'تظهر على الجدار', 'الرسائل المعتمدة فقط تظهر في جدار الأثر الطيب وركن الامتنان.'],
            ].map(([n, t, d]) => (
              <li key={n} className="rounded-2xl bg-cream p-5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-rosewood font-display text-lg text-white">{n}</span>
                <p className="mt-3 font-bold text-plum">{t}</p>
                <p className="mt-1 text-sm text-ink/70">{d}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}
