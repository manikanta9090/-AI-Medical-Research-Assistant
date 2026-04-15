import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Send } from 'lucide-react'

export default function InputBar({ onSend, disabled }) {
  const [input, setInput] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (input.trim() && !disabled) {
      onSend(input)
      setInput('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-border">
      <div className="flex gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about medical research..."
          disabled={disabled}
          className={cn(
            "flex-1 px-4 py-3 rounded-lg",
            "bg-background border border-input",
            "text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "transition-all duration-200"
          )}
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className={cn(
            "p-3 rounded-lg transition-all duration-200",
            "bg-primary text-primary-foreground",
            "hover:bg-primary/90",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            "flex items-center justify-center"
          )}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  )
}