import { useState, useEffect } from 'react'

const TypingIndicator = ({ users = [], className = '' }) => {
  const [dots, setDots] = useState('.')

  useEffect(() => {
    if (users.length === 0) return

    const interval = setInterval(() => {
      setDots(prev => {
        if (prev === '...') return '.'
        return prev + '.'
      })
    }, 500)

    return () => clearInterval(interval)
  }, [users.length])

  if (users.length === 0) return null

  const getTypingText = () => {
    if (users.length === 1) {
      return `${users[0].name} is typing${dots}`
    } else if (users.length === 2) {
      return `${users[0].name} and ${users[1].name} are typing${dots}`
    } else {
      return `${users[0].name} and ${users.length - 1} others are typing${dots}`
    }
  }

  return (
    <div className={`flex items-center space-x-2 text-sm text-light-text-secondary dark:text-dark-text-secondary ${className}`}>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-brand-orange-light dark:bg-brand-orange-dark rounded-full animate-bounce" 
             style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 bg-brand-orange-light dark:bg-brand-orange-dark rounded-full animate-bounce" 
             style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 bg-brand-orange-light dark:bg-brand-orange-dark rounded-full animate-bounce" 
             style={{ animationDelay: '300ms' }} />
      </div>
      <span className="italic">{getTypingText()}</span>
    </div>
  )
}

export default TypingIndicator
