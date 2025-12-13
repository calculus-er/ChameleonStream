'use client'

import { motion } from 'framer-motion'

export default function Footer() {
  return (
    <footer className="py-8 px-6 lg:px-12 bg-background border-t border-accent-green/20">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Chameleon <span className="text-accent-green">Stream</span>
            </h3>
            <p className="text-foreground-muted text-sm">
              AI-powered localization for global content
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex gap-6 text-sm text-foreground-muted"
          >
            <a href="#" className="hover:text-accent-green transition-colors">Privacy</a>
            <a href="#" className="hover:text-accent-green transition-colors">Terms</a>
            <a href="#" className="hover:text-accent-green transition-colors">Contact</a>
          </motion.div>
        </div>
        
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 pt-8 border-t border-accent-green/20 text-center text-sm text-foreground-muted"
        >
          <p>&copy; {new Date().getFullYear()} Chameleon Stream. All rights reserved.</p>
        </motion.div>
      </div>
    </footer>
  )
}

