'use client'

import { motion } from 'framer-motion'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Content Creator',
      company: 'Global Media Co.',
      image: '👩‍💼',
      text: 'Chameleon Stream transformed our localization workflow. What used to take weeks now takes hours, and the quality is incredible.',
      rating: 5,
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Video Producer',
      company: 'Digital Studios',
      image: '👨‍🎬',
      text: 'The lip-sync accuracy is mind-blowing. Our international audience can\'t tell the difference from the original content.',
      rating: 5,
    },
    {
      name: 'Emma Thompson',
      role: 'Marketing Director',
      company: 'Tech Innovations',
      image: '👩‍💻',
      text: 'We\'ve localized content for 20+ markets with Chameleon Stream. The ROI has been phenomenal.',
      rating: 5,
    },
  ]

  return (
    <section className="py-16 px-6 lg:px-12 bg-background relative overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-green/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <div className="inline-block mb-4 px-4 py-2 bg-accent-green/20 border border-accent-green/30 rounded-full text-accent-green text-sm font-semibold">
            Client Stories
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            What Our Clients Say
          </h2>
          <p className="text-lg text-foreground-muted max-w-3xl mx-auto">
            Join thousands of satisfied creators using Chameleon Stream
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-background-light rounded-2xl p-8 border border-accent-green/20 hover:border-accent-green/40 transition-all duration-300 hover:shadow-xl hover:shadow-accent-green/10"
            >
              <div className="flex items-center gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-accent-green"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-foreground-muted mb-6 leading-relaxed text-lg">
                "{testimonial.text}"
              </p>
              <div className="flex items-center gap-4">
                <div className="text-4xl">{testimonial.image}</div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-foreground-muted">
                    {testimonial.role} at {testimonial.company}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

