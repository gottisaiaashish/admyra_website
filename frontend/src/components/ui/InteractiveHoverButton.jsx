import React, { useState } from 'react'
import { ArrowRight, Check } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs) { return twMerge(clsx(inputs)) }

export default function InteractiveHoverButton({
  text = 'Submit Audit',
  loadingText = 'Processing...',
  successText = 'Audit Reported!',
  onComplete,
  disabled,
  className
}) {
  const [status, setStatus] = useState('idle')

  const isIdle = status === 'idle'

  const handleClick = () => {
    if (status !== 'idle' || disabled) return

    setStatus('loading')
    // Simulate async process (for demo purpose only)
    setTimeout(() => {
      setStatus('success')
      if (onComplete) onComplete();
      
      setTimeout(() => {
        setStatus('idle')
      }, 3000) // Reset after success
    }, 2000)
  }

  return (
    <motion.button
      className={cn(
        'group bg-black relative flex min-w-56 items-center justify-center overflow-hidden rounded-full border border-white/10 p-4 px-8 font-black uppercase tracking-widest text-[10px] transition-all duration-300',
        status === 'loading' && 'px-4', 
        disabled ? 'opacity-20 cursor-not-allowed' : 'opacity-100 cursor-pointer hover:border-emerald-500/50',
        className
      )}
      onClick={handleClick}
      layout
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
    >
      <AnimatePresence mode='popLayout' initial={false}>
        <motion.div
          key={status}
          className='flex items-center gap-3'
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          {status === 'idle' && (
            <>
              <div
                className={cn(
                  'bg-emerald-500 h-2 w-2 rounded-full transition-all duration-500 group-hover:scale-[60]',
                  !isIdle && 'scale-[60]'
                )}
              />
              <span
                className={cn(
                  'inline-block transition-all duration-500 text-white group-hover:translate-x-20 group-hover:opacity-0',
                  !isIdle && 'translate-x-20 opacity-0'
                )}
              >
                {text}
              </span>
              <div
                className={cn(
                  'text-black absolute top-0 left-0 z-10 flex h-full w-full -translate-x-16 items-center justify-center gap-2 opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100',
                  !isIdle && 'translate-x-0 opacity-100'
                )}
              >
                <span className="font-black">{text}</span>
                <ArrowRight className='h-4 w-4' />
              </div>
            </>
          )}

          {status === 'loading' && (
            <div className="flex items-center gap-3">
              <div className='border-emerald-500 border-t-transparent h-4 w-4 animate-spin rounded-full border-2' />
              <span className='text-emerald-500'>{loadingText}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="flex items-center gap-3 text-emerald-500">
              <Check className='h-4 w-4' />
              <span>{successText}</span>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </motion.button>
  )
}
