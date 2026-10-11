import { Mail } from 'lucide-react'
import { Heart, SectionTitle, Sprig } from '../Decor'
import { EntryForm } from '../EntryForm'
import type { PublicEntry } from '../../lib/submissions'
import { PARTICIPANT_TYPES } from '../../lib/options'
import { byline, useHearts } from './shared'

export function Gratitude({ entries }: { entries: PublicEntry[] }) {
  const { counts, given, give } = useHearts(entries)

  return (
    <section id="gratitude" className="paper px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <SectionTitle eyebrow="ركن الامتنان" title="شكرًا… كلمة صغيرة بأثر كبير">
          لمعلمة أضاءت يومك، أو صديقة ساندتك، أو أم وأب يرعيانك… اكتبي رسالة شكر وامتنان.
        </SectionTitle>

        <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr]">
          <div className="reveal relative h-fit rounded-[2rem] bg-ivory p-6 shadow-lg shadow-rose/10 ring-1 ring-beige sm:p-8 lg:sticky lg:top-28">
            <Sprig className="absolute -top-3 left-6 h-8 w-28" />
            <div className="mb-5 flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blush text-rosewood">
                <Mail className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-xl font-bold text-plum">اكتبي رسالة امتنان</h3>
                <p className="text-sm text-ink/60">تُنشر تلقائيًا وفورًا دون موافقة مسبقة</p>
              </div>
            </div>
            <EntryForm fixedCategory="gratitude" submitLabel="إرسال رسالة الشكر" variant="compact" />
          </div>

          <div>
            {entries.length === 0 ? (
              <div className="reveal grid h-full place-items-center rounded-[2rem] border-2 border-dashed border-sand bg-ivory/60 p-10 text-center">
                <div>
                  <Heart className="mx-auto h-10 w-10 text-rose" />
                  <p className="mt-3 font-display text-xl font-bold text-plum">رسائل الشكر ستظهر هنا</p>
                  <p className="mt-1 text-ink/70">تُنشر تلقائيًا فور إرسالها. ابدئي بأول رسالة امتنان!</p>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {entries.map((e) => {
                  const hearted = given.includes(e.id)
                  return (
                    <article key={e.id} className="reveal relative rounded-3xl bg-ivory p-6 pt-8 ring-1 ring-beige transition hover:-translate-y-1 hover:shadow-lg hover:shadow-rose/15">
                      <span className="absolute -top-3 right-6 grid h-7 w-7 place-items-center rounded-full bg-rose text-white shadow">
                        <Heart className="h-3.5 w-3.5" />
                      </span>
                      {e.recipient && <p className="font-hand text-xl text-rosewood">إلى {e.recipient}</p>}
                      <p className="mt-1 whitespace-pre-line leading-8 text-ink">{e.message}</p>
                      <footer className="mt-4 flex items-center justify-between border-t border-beige pt-3 text-sm">
                        <span className="text-ink/60">{byline(e, PARTICIPANT_TYPES)}</span>
                        <button
                          onClick={() => give(e.id)}
                          disabled={hearted}
                          aria-label="أرسلي قلبًا لهذه الرسالة"
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 transition ${hearted ? 'bg-rosewood text-white' : 'bg-blush/60 text-rosewood hover:scale-110'}`}
                        >
                          <Heart className="h-4 w-4" filled={hearted} />
                          <span className="tabular-nums">{counts[e.id] ?? 0}</span>
                        </button>
                      </footer>
                    </article>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
