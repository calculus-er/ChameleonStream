'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface FeatureCardProps {
  title: string
  description: string
  icon: ReactNode
  delay?: number
  side?: 'left' | 'right'
}

export default function FeatureCard({ 
  title, 
  description, 
  icon, 
  delay = 0,
  side = 'right'
}: FeatureCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.6, delay }}
      className="bg-background-light/50 backdrop-blur-sm rounded-2xl p-6 border border-accent-green/20 hover:border-accent-green/40 transition-all duration-300 hover:shadow-xl hover:shadow-accent-green/10"
      whileHover={{ scale: 1.02, y: -3 }}
    >
      <div className="mb-4 text-accent-green">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3 text-foreground">{title}</h3>
      <p className="text-foreground-muted leading-relaxed">{description}</p>
    </motion.div>
  )
}
