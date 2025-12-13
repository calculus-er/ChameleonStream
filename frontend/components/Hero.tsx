'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Chameleon from './Chameleon'

export default function Hero() {
  const [scrollY, setScrollY] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('scroll', handleScroll)
    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background-light to-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-accent-green/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-accent-teal/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="z-10 order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-block mb-4 px-4 py-2 bg-accent-green/20 border border-accent-green/30 rounded-full text-accent-green text-sm font-semibold"
            >
              AI-Powered Localization
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-7xl font-bold mb-4 text-foreground leading-tight"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Chameleon
              <span className="block text-accent-green bg-gradient-to-r from-accent-green to-accent-teal bg-clip-text text-transparent">
                Stream
              </span>
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl text-foreground-muted mb-4 leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              Transform your content for global audiences with AI-powered localization.
              Flawless lip-sync, translated audio, and dynamic visual context adaptation.
            </motion.p>

            {/* Feature highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-3 gap-3 mb-4"
            >
              <div className="text-center p-3 bg-background-light/50 rounded-lg border border-accent-green/20">
                <div className="text-xl font-bold text-accent-green mb-1">5+</div>
                <div className="text-xs text-foreground-muted">Languages</div>
              </div>
              <div className="text-center p-3 bg-background-light/50 rounded-lg border border-accent-green/20">
                <div className="text-xl font-bold text-accent-green mb-1">&gt;90%</div>
                <div className="text-xs text-foreground-muted">Accuracy</div>
              </div>
              <div className="text-center p-3 bg-background-light/50 rounded-lg border border-accent-green/20">
                <div className="text-xl font-bold text-accent-green mb-1">24/7</div>
                <div className="text-xs text-foreground-muted">Processing</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="flex gap-3 flex-wrap mb-4"
            >
              <button
                onClick={() => document.getElementById('upload-section')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-6 py-3 bg-accent-green text-background rounded-lg font-semibold hover:bg-accent-green-dark transition-all shadow-lg hover:shadow-xl hover:shadow-accent-green/50 transform hover:scale-105"
              >
                Try Now
              </button>
            </motion.div>


          </motion.div>

          {/* Chameleon Illustration */}
          <div className="relative h-[400px] lg:h-[600px] w-full order-1 lg:order-2">
            <motion.div
              className="sticky top-20 h-full"
              initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, delay: 0.4, type: 'spring' }}
            >
              <Chameleon
                scrollY={scrollY}
                mouseX={mousePosition.x}
                mouseY={mousePosition.y}
                size="extra-large"
              />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 border-2 border-accent-green/50 rounded-full flex justify-center p-2">
          <motion.div
            className="w-1 h-3 bg-accent-green rounded-full"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  )
}
