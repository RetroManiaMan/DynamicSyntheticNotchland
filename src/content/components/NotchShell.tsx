import { forwardRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type NotchShellProps = {
  isExpanded: boolean
  isSaver: boolean
  collapsedWidth: string
  onMouseEnter: () => void
  onMouseLeave: () => void
  collapsedContent: ReactNode
  expandedContent: ReactNode
}

export const NotchShell = forwardRef<HTMLDivElement, NotchShellProps>(
  (
    {
      isExpanded,
      isSaver,
      collapsedWidth,
      onMouseEnter,
      onMouseLeave,
      collapsedContent,
      expandedContent,
    },
    ref,
  ) => {
    return (
      <div className="dsn-shell-wrap" ref={ref} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <motion.div
          className={`dsn-shell ${isSaver ? 'is-saver' : ''}`}
          animate={{
            width: isExpanded ? 'min(640px, calc(100vw - 32px))' : collapsedWidth,
            borderRadius: isExpanded ? '24px' : '999px',
          }}
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 30,
            mass: 0.7,
          }}
          role="presentation"
          aria-live="polite"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              >
                {expandedContent}
              </motion.div>
            ) : (
              <motion.div
                key="collapsed"
                className="dsn-collapsed-slot"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
              >
                {collapsedContent}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    )
  },
)

NotchShell.displayName = 'NotchShell'
