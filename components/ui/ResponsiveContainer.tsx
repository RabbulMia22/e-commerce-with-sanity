import React from 'react'

interface ResponsiveContainerProps {
  children: React.ReactNode
  className?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full'
}

const paddingClasses = {
  none: '',
  sm: 'px-4 py-2',
  md: 'px-4 sm:px-6 py-4',
  lg: 'px-4 sm:px-6 lg:px-8 py-6 lg:py-8'
}

export function ResponsiveContainer({ 
  children, 
  className = '',
  maxWidth = '7xl',
  padding = 'lg'
}: ResponsiveContainerProps) {
  return (
    <div className={`
      mx-auto w-full
      ${maxWidthClasses[maxWidth]}
      ${paddingClasses[padding]}
      ${className}
    `.trim()}>
      {children}
    </div>
  )
}

export default ResponsiveContainer