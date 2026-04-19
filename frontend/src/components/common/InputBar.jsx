import { useState, useRef } from 'react'
import { Send, Mic, Plus, MicOff } from 'lucide-react'

export default function InputBar({ onSend, disabled }) {
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [fileName, setFileName] = useState('')
  const fileInputRef = useRef(null)
  const recognitionRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    const finalInput = fileName ? `${input} [${fileName}]` : input
    if (finalInput.trim() && !disabled) {
      onSend(finalInput)
      setInput('')
      setFileName('')
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleFileSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFileName(file.name)
    }
    e.target.value = ''
  }

  const handleFileButton = () => {
    fileInputRef.current?.click()
  }

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      alert('Voice input is not supported in this browser. Please use Chrome or Edge.')
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const recognition = new SpeechRecognition()
    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onstart = () => {
      setIsListening(true)
    }

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0].transcript)
        .join('')
      setInput(transcript)
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.start()
    recognitionRef.current = recognition
  }

  return (
    <form onSubmit={handleSubmit} className="flex-shrink-0 p-4 pb-6 border-t border-gray-700 bg-black">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        multiple
      />
      
      {fileName && (
        <div className="px-4 pb-2 text-xs text-gray-400">
          Selected: {fileName}
        </div>
      )}
      
      <div className="flex items-center gap-2 bg-gray-800 rounded-full border border-gray-600 px-4 py-2">
        <button
          type="button"
          onClick={handleFileButton}
          className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
          title="Add file"
        >
          <Plus className="w-5 h-5" />
        </button>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Send a message..."
          disabled={disabled}
          className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
        />
        
        <button
          type="button"
          onClick={startVoiceInput}
          className={`p-2 rounded-full transition-colors ${
            isListening 
              ? 'text-red-500 hover:text-red-400 bg-red-500/20' 
              : 'text-gray-400 hover:text-white hover:bg-gray-700'
          }`}
          title={isListening ? "Stop listening" : "Voice input"}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
        
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </form>
  )
}