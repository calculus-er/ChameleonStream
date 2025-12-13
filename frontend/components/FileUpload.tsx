'use client'

import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import Chameleon from './Chameleon'
import Processing from './Processing'

export default function FileUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files).filter(file =>
      file.type === 'video/mp4' || file.name.toLowerCase().endsWith('.mp4') ||
      file.type === 'video/quicktime' || file.name.toLowerCase().endsWith('.mov')
    )
    setUploadedFiles(prev => [...prev, ...files])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter(file =>
        file.type === 'video/mp4' || file.name.toLowerCase().endsWith('.mp4') ||
        file.type === 'video/quicktime' || file.name.toLowerCase().endsWith('.mov')
      )
      setUploadedFiles(prev => [...prev, ...files])
    }
  }

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleProcessFiles = () => {
    if (uploadedFiles.length > 0) {
      setIsProcessing(true)
    }
  }

  const handleProcessingComplete = (videoUrl: string) => {
    setProcessedVideoUrl(videoUrl)
  }

  const handleBackToUpload = () => {
    setIsProcessing(false)
    setProcessedVideoUrl(null)
    setUploadedFiles([])
  }

  // Show processing screen if processing
  if (isProcessing) {
    return (
      <Processing
        files={uploadedFiles}
        onComplete={handleProcessingComplete}
        onBack={handleBackToUpload}
      />
    )
  }

  return (
    <section id="upload-section" className="py-12 px-6 lg:px-12 bg-background-light relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-teal/5 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Chameleon and info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-4"
          >
            <div className="flex justify-center lg:justify-start">
              <div className="w-56 h-56 lg:w-64 lg:h-64">
                <Chameleon size="large" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold mb-3 text-foreground">
                Ready to Transform Your Content?
              </h3>
              <p className="text-base text-foreground-muted leading-relaxed">
                Upload your MP4 or MOV video files and let our AI handle the rest.
              </p>
            </div>
          </motion.div>

          {/* Right side - Upload area */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-6"
          >
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`
                relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer
                transition-all duration-300
                ${isDragging
                  ? 'border-accent-green bg-accent-green/10 scale-105'
                  : 'border-accent-green/30 hover:border-accent-green/50 hover:bg-accent-green/5'
                }
              `}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".mp4,.mov"
                onChange={handleFileSelect}
                className="hidden"
              />

              <motion.div
                animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  className="w-12 h-12 mx-auto mb-3 text-accent-green"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <h4 className="text-lg font-semibold mb-2 text-foreground">
                  {isDragging ? 'Drop files here' : 'Drag & drop files here'}
                </h4>
                <p className="text-foreground-muted mb-2 text-sm">
                  or click to browse
                </p>
                <p className="text-xs text-foreground-muted/70">
                  Only MP4 or MOV files are allowed (Max 500MB)
                </p>
              </motion.div>
            </div>

            {/* Uploaded files list */}
            {uploadedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3"
              >
                <h5 className="text-lg font-semibold text-foreground">
                  Uploaded Files ({uploadedFiles.length})
                </h5>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {uploadedFiles.map((file, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-4 bg-background rounded-lg border border-accent-green/20"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-10 h-10 bg-accent-green/20 rounded-lg flex items-center justify-center">
                          <svg
                            className="w-6 h-6 text-accent-green"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-foreground-muted">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFile(index)
                        }}
                        className="ml-4 p-2 text-foreground-muted hover:text-accent-green transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </motion.div>
                  ))}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleProcessFiles}
                  className="w-full px-6 py-3 bg-accent-green text-background rounded-lg font-semibold hover:bg-accent-green-dark transition-colors shadow-lg hover:shadow-xl hover:shadow-accent-green/50"
                >
                  Process Files
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

