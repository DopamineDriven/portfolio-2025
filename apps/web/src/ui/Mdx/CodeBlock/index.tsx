'use client'

import React, { useState } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { motion, AnimatePresence } from 'motion/react';
import { Copy, Check } from 'lucide-react'

interface CodeBlockProps {
  children: string
  className?: string
}

const CodeBlock: React.FC<CodeBlockProps> = ({ children, className }) => {
  const [isCopied, setIsCopied] = useState(false)
  const language = className ? className.replace(/language-/, '') : 'text'

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={true}
        wrapLines={true}
        customStyle={{
          padding: '1rem',
          borderRadius: '0.5rem',
          fontSize: '0.875rem',
          backgroundColor: 'hsl(var(--muted))',
        }}
        lineNumberStyle={{
          minWidth: '2.5em',
          paddingRight: '1em',
          textAlign: 'right',
          userSelect: 'none',
          color: 'hsl(var(--muted-foreground))',
        }}
      >
        {children}
      </SyntaxHighlighter>
      <motion.button
        onClick={async () => {
          await navigator.clipboard.writeText(children)
          setIsCopied(true)
          setTimeout(() => setIsCopied(false), 1500)
        }}
        className={`absolute top-2 right-2 p-2 rounded-md ${
          isCopied ? 'bg-green-500' : 'bg-primary'
        } text-primary-foreground hover:bg-primary/90 transition-colors duration-200`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Copy to clipboard"
      >
        <AnimatePresence mode="wait" initial={false}>
          {isCopied ? (
            <motion.div
              key="check"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Check className="h-4 w-4" />
            </motion.div>
          ) : (
            <motion.div
              key="copy"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
            >
              <Copy className="h-4 w-4" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>
    </motion.div>
  )
}

export default CodeBlock

