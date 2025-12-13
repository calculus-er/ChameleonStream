import Hero from '@/components/Hero'

import Features from '@/components/Features'
import HowItWorks from '@/components/HowItWorks'
import FileUpload from '@/components/FileUpload'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />

      <Features />
      <HowItWorks />
      <FileUpload />
      <Footer />
    </main>
  )
}

