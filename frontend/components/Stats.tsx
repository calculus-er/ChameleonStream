'use client'

import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

interface StatItemProps {
  value: string
  label: string
  delay: number
}

function StatItem({ value, label, delay }: StatItemProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className="text-center"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : {}}
        transition={{ duration: 0.5, delay: delay + 0.2, type: 'spring' }}
        className="text-5xl md:text-6xl lg:text-7xl font-bold text-accent-green mb-2"
      >
        {value}
      </motion.div>
      <div className="text-lg md:text-xl text-foreground-muted">{label}</div>
    </motion.div>
  )
}

export default function Stats() {
  const stats = [
    { value: '50+', label: 'Languages Supported' },
    { value: '99.9%', label: 'Accuracy Rate' },
    { value: '10K+', label: 'Projects Completed' },
    { value: '24/7', label: 'AI Processing' },
  ]

  return (
    <section className="py-12 px-6 lg:px-12 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-accent-green/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 text-foreground">
            Trusted by Creators Worldwide
          </h2>
          <p className="text-base text-foreground-muted max-w-2xl mx-auto">
            Numbers that speak for themselves
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, index) => (
            <StatItem
              key={stat.label}
              value={stat.value}
              label={stat.label}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

