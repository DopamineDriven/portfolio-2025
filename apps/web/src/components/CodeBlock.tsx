"use client";
import React from 'react'
import { CopyButton } from './CopyButton'

interface CodeBlockProps {
  children: React.ReactNode
  className?: string
}

export function CodeBlock({ children, className }: CodeBlockProps) {
  const codeRef = React.useRef<HTMLPreElement>(null)

  const getCode = () => {
    if (codeRef.current) {
      return codeRef.current.textContent ?? ''
    }
    return ''
  }

  return (
    <div className="relative">
      <pre ref={codeRef} className={`${className} overflow-x-auto p-4`}>
        <CopyButton getCodeAction={getCode} />
        {children}
      </pre>
    </div>
  )
}

