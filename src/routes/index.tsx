import { createFileRoute } from '@tanstack/react-router'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { RevealOnScroll } from '../components/Decor'
import { Hero } from '../components/sections/Hero'
import { About } from '../components/sections/About'
import { Founder } from '../components/sections/Founder'
import { Wellbeing } from '../components/sections/Wellbeing'
import { Wall } from '../components/sections/Wall'
import { Gratitude } from '../components/sections/Gratitude'
import { Participate } from '../components/sections/Participate'
import { Activities } from '../components/sections/Activities'
import { Privacy } from '../components/sections/Privacy'
import { getPublishedEntries } from '../lib/submissions'

export const Route = createFileRoute('/')({
  loader: async () => {
    try {
      return await getPublishedEntries()
    } catch {
      return { wall: [], gratitude: [] }
    }
  },
  component: Home,
})

function Home() {
  const { wall, gratitude } = Route.useLoaderData()
  return (
    <RevealOnScroll>
      <Header />
      <main>
        <Hero />
        <About />
        <Founder />
        <Wellbeing />
        <Wall entries={wall} />
        <Gratitude entries={gratitude} />
        <Participate />
        <Activities />
        <Privacy />
      </main>
      <Footer />
    </RevealOnScroll>
  )
}
