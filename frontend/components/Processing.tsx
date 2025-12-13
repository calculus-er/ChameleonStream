'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Chameleon from './Chameleon'

interface ProcessingProps {
  files: File[]
  onComplete: (videoUrl: string) => void
  onBack: () => void
}

interface ProcessingStage {
  name: string
  completed: boolean
}

export default function Processing({ files, onComplete, onBack }: ProcessingProps) {
  const [audioProgress, setAudioProgress] = useState(0)
  const [videoProgress, setVideoProgress] = useState(0)
  const [audioComplete, setAudioComplete] = useState(false)
  const [videoComplete, setVideoComplete] = useState(false)
  const [merged, setMerged] = useState(false)
  const [finalVideoUrl, setFinalVideoUrl] = useState<string | null>(null)

  // Audio processing stages
  const [audioStages, setAudioStages] = useState<ProcessingStage[]>([
    { name: 'Automatic Speech Recognition (ASR)', completed: false },
    { name: 'Speech to Text', completed: false },
    { name: 'Text Translate', completed: false },
    { name: 'Converting to Audio', completed: false },
  ])

  // Video processing stages
  const [videoStages, setVideoStages] = useState<ProcessingStage[]>([
    { name: 'Extracting the frames', completed: false },
    { name: 'Analyzing the foreign texts', completed: false },
    { name: 'Translating the texts', completed: false },
    { name: 'Overlaying the texts', completed: false },
    { name: 'Lip syncing the videos', completed: false },
  ])

  useEffect(() => {
    // Simulate audio processing with stages
    const audioDuration = 3000 + Math.random() * 4000
    
    let currentStage = 0
    const audioInterval = setInterval(() => {
      setAudioProgress((prev) => {
        const newProgress = prev + (100 / (audioDuration / 50))
        
        // Complete stages as progress increases
        if (newProgress >= 25 && currentStage === 0) {
          setAudioStages(prev => prev.map((stage, i) => i === 0 ? { ...stage, completed: true } : stage))
          currentStage = 1
        } else if (newProgress >= 50 && currentStage === 1) {
          setAudioStages(prev => prev.map((stage, i) => i === 1 ? { ...stage, completed: true } : stage))
          currentStage = 2
        } else if (newProgress >= 75 && currentStage === 2) {
          setAudioStages(prev => prev.map((stage, i) => i === 2 ? { ...stage, completed: true } : stage))
          currentStage = 3
        } else if (newProgress >= 100 && currentStage === 3) {
          setAudioStages(prev => prev.map((stage, i) => i === 3 ? { ...stage, completed: true } : stage))
          clearInterval(audioInterval)
          setAudioComplete(true)
          return 100
        }
        
        return Math.min(newProgress, 100)
      })
    }, 50)

    // Simulate video processing with stages
    const videoDuration = 4000 + Math.random() * 4000
    let currentVideoStage = 0
    const videoInterval = setInterval(() => {
      setVideoProgress((prev) => {
        const newProgress = prev + (100 / (videoDuration / 50))
        
        // Complete stages as progress increases
        if (newProgress >= 20 && currentVideoStage === 0) {
          setVideoStages(prev => prev.map((stage, i) => i === 0 ? { ...stage, completed: true } : stage))
          currentVideoStage = 1
        } else if (newProgress >= 40 && currentVideoStage === 1) {
          setVideoStages(prev => prev.map((stage, i) => i === 1 ? { ...stage, completed: true } : stage))
          currentVideoStage = 2
        } else if (newProgress >= 60 && currentVideoStage === 2) {
          setVideoStages(prev => prev.map((stage, i) => i === 2 ? { ...stage, completed: true } : stage))
          currentVideoStage = 3
        } else if (newProgress >= 80 && currentVideoStage === 3) {
          setVideoStages(prev => prev.map((stage, i) => i === 3 ? { ...stage, completed: true } : stage))
          currentVideoStage = 4
        } else if (newProgress >= 100 && currentVideoStage === 4) {
          setVideoStages(prev => prev.map((stage, i) => i === 4 ? { ...stage, completed: true } : stage))
          clearInterval(videoInterval)
          setVideoComplete(true)
          return 100
        }
        
        return Math.min(newProgress, 100)
      })
    }, 50)

    return () => {
      clearInterval(audioInterval)
      clearInterval(videoInterval)
    }
  }, [])

  useEffect(() => {
    // When both are complete, merge them
    if (audioComplete && videoComplete && !merged) {
      setTimeout(() => {
        setMerged(true)
        setTimeout(() => {
          setFinalVideoUrl('/sample-video.mp4')
          onComplete('/sample-video.mp4')
        }, 1500)
      }, 500)
    }
  }, [audioComplete, videoComplete, merged, onComplete])

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background-light to-background py-12 px-6 lg:px-12">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-foreground">
            Processing Your Content
          </h2>
          <p className="text-base text-foreground-muted">
            Our AI is working its magic...
          </p>
        </motion.div>

        {/* Chameleon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="flex justify-center mb-6"
        >
          <div className="w-40 h-40">
            <Chameleon size="large" />
          </div>
        </motion.div>

        {/* Processing Bars */}
        <div className="space-y-4 mb-6">
          {/* Audio Processing */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-background-light rounded-2xl p-5 border border-accent-green/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-green/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Processing Audio</h3>
                </div>
              </div>
              <AnimatePresence mode="wait">
                {audioComplete ? (
                  <motion.div
                    key="complete"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    key="loading"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full"
                  />
                )}
              </AnimatePresence>
            </div>
            
            {/* Audio Stages */}
            <div className="space-y-2 mb-4">
              {audioStages.map((stage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                    stage.completed ? 'bg-accent-green' : 'bg-background border-2 border-accent-green/30'
                  }`}>
                    {stage.completed && (
                      <svg className="w-3 h-3 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={stage.completed ? 'text-foreground' : 'text-foreground-muted'}>
                    {stage.name}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="w-full h-3 bg-background rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent-green to-accent-teal"
                initial={{ width: 0 }}
                animate={{ width: `${audioProgress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            <div className="mt-2 text-right text-sm text-foreground-muted">
              {Math.round(audioProgress)}%
            </div>
          </motion.div>

          {/* Video Processing */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-background-light rounded-2xl p-5 border border-accent-green/20"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent-green/20 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">Processing Video</h3>
                </div>
              </div>
              <AnimatePresence mode="wait">
                {videoComplete ? (
                  <motion.div
                    key="complete"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-8 h-8 bg-accent-green rounded-full flex items-center justify-center"
                  >
                    <svg className="w-5 h-5 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                ) : (
                  <motion.div
                    key="loading"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-8 h-8 border-2 border-accent-green border-t-transparent rounded-full"
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Video Stages */}
            <div className="space-y-2 mb-4">
              {videoStages.map((stage, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                    stage.completed ? 'bg-accent-green' : 'bg-background border-2 border-accent-green/30'
                  }`}>
                    {stage.completed && (
                      <svg className="w-3 h-3 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <span className={stage.completed ? 'text-foreground' : 'text-foreground-muted'}>
                    {stage.name}
                  </span>
                </motion.div>
              ))}
            </div>

            <div className="w-full h-3 bg-background rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-accent-green to-accent-teal"
                initial={{ width: 0 }}
                animate={{ width: `${videoProgress}%` }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
              />
            </div>
            <div className="mt-2 text-right text-sm text-foreground-muted">
              {Math.round(videoProgress)}%
            </div>
          </motion.div>
        </div>

        {/* Merging Animation */}
        <AnimatePresence>
          {audioComplete && videoComplete && !merged && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-center mb-4"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="inline-block"
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-accent-green/20 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-accent-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </motion.div>
              <p className="text-base font-semibold text-accent-green">Merging audio and video...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Final Video Result */}
        <AnimatePresence>
          {finalVideoUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="bg-background-light rounded-2xl p-5 border border-accent-green/40"
            >
              <div className="text-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                  className="w-12 h-12 mx-auto mb-3 bg-accent-green rounded-full flex items-center justify-center"
                >
                  <svg className="w-6 h-6 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h3 className="text-xl font-bold mb-2 text-foreground">Processing Complete!</h3>
                <p className="text-sm text-foreground-muted">Your localized content is ready</p>
              </div>

              {/* Video Preview Placeholder */}
              <div className="bg-background rounded-xl p-4 mb-4 border border-accent-green/20">
                <div className="aspect-video bg-background-light rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-12 h-12 mx-auto mb-3 text-accent-green/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-foreground-muted text-sm">Video Preview</p>
                  </div>
                </div>
              </div>

              {/* Download Button */}
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 px-6 py-3 bg-accent-green text-background rounded-lg font-semibold hover:bg-accent-green-dark transition-all shadow-lg hover:shadow-xl hover:shadow-accent-green/50 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Video
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onBack}
                  className="px-6 py-3 bg-transparent border-2 border-accent-green text-accent-green rounded-lg font-semibold hover:bg-accent-green/10 transition-all"
                >
                  Process Another
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back Button (only show when not complete) */}
        {!finalVideoUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-6"
          >
            <button
              onClick={onBack}
              className="text-foreground-muted hover:text-accent-green transition-colors"
            >
              ← Back to upload
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}
