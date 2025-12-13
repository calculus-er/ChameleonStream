'use client'

import { useEffect, useRef } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'
import Image from 'next/image'

interface ChameleonProps {
  scrollY?: number
  mouseX?: number
  mouseY?: number
  size?: 'small' | 'medium' | 'large' | 'extra-small' | 'extra-large'
  className?: string
}

export default function Chameleon({
  scrollY = 0,
  mouseX = 0,
  mouseY = 0,
  size = 'large',
  className = '',
}: ChameleonProps) {


  // Scroll-based horizontal position (only for hero)
  const xPosition = useTransform(
    useSpring(scrollY, { stiffness: 100, damping: 30 }),
    [0, 500],
    [0, -200]
  )

  const sizeClasses = {
    small: 'w-24 h-24',
    medium: 'w-40 h-40',
    large: 'w-full h-full max-w-[500px] max-h-[500px]',
    'extra-small': 'w-16 h-16',
    'extra-large': 'w-full h-full max-w-[700px] max-h-[700px]',
  }



  return (
    <motion.div
      className={`relative flex items-center justify-center ${sizeClasses[size]} ${className}`}
      style={size === 'large' ? { x: xPosition } : {}}
      animate={{
        y: [0, -10, 0],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      <motion.div
        className="relative w-full h-full"
        animate={{
          scale: [1, 1.05, 1],
          rotate: [0, 2, -2, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      >
        <Image
          src="/chameleon.png"
          alt="Chameleon"
          fill
          className="object-contain drop-shadow-2xl z-10 hero-chameleon-target"
          style={{
            filter: 'drop-shadow(0 0 30px rgba(34, 197, 94, 0.3))',
          }}
          priority={size === 'large' || size === 'extra-large'}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />



        {/* Glow effect */}
        <motion.div
          className="absolute inset-0 bg-accent-green/20 rounded-full blur-3xl -z-10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </motion.div>
  )
}
