import { useEffect, useState } from 'react'
import { sendHeart, type PublicEntry } from '../../lib/submissions'

const STORAGE_KEY = 'athar-hearted'

/** Hearts are counted on the server; localStorage only stops one browser from repeating a heart. */
export function useHearts(entries: PublicEntry[]) {
  const [counts, setCounts] = useState<Record<number, number>>(() => Object.fromEntries(entries.map((e) => [e.id, e.hearts])))
  const [given, setGiven] = useState<number[]>([])

  useEffect(() => {
    setCounts(Object.fromEntries(entries.map((entry) => [entry.id, entry.hearts])))
  }, [entries])

  useEffect(() => {
    try {
      setGiven(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'))
    } catch {
      setGiven([])
    }
  }, [])

  async function give(id: number) {
    if (given.includes(id)) return
    const next = [...given, id]
    setGiven(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setCounts((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 }))
    try {
      const { hearts } = await sendHeart({ data: { id } })
      setCounts((c) => ({ ...c, [id]: hearts }))
    } catch {
      // keep the optimistic count
    }
  }

  return { counts, given, give }
}

export function byline(e: PublicEntry, labels: Record<string, string>) {
  const who = labels[e.participantType] ?? ''
  return e.name ? `${e.name} · ${who}` : who
}
