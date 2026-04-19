import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Plus, MessageSquare, Trash2 } from 'lucide-react'

export default function Sidebar({ 
  conversations = [], 
  currentChatId, 
  onNewChat, 
  onSelectChat,
  onContextSave 
}) {
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    gender: '',
    disease: '',
    symptoms: '',
    location: ''
  })
  const [savedContext, setSavedContext] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    const context = { ...formData }
    setSavedContext(context)
    console.log('Context saved:', context)
    if (onContextSave) {
      onContextSave(context)
    }
  }

  const isFormEmpty = !formData.patientName && !formData.disease && !formData.age && !formData.gender && !formData.symptoms

  return (
    <aside className="w-full h-full flex flex-col">
      {/* New Chat Button */}
      <div className="p-3 border-b border-gray-700">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span className="font-medium">New Chat</span>
        </button>
      </div>

      {/* Chat History List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <div className="text-xs font-medium text-gray-500 uppercase px-2 mb-2">Chat History</div>
        {conversations.length === 0 ? (
          <p className="text-gray-500 text-sm px-2">No chats yet</p>
        ) : (
          conversations.map((chat) => (
            <button
              key={chat.id}
              onClick={() => onSelectChat(chat.id)}
              className={cn(
                "w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors",
                chat.id === currentChatId 
                  ? "bg-blue-600/20 text-blue-400 border border-blue-600/30" 
                  : "text-gray-300 hover:bg-white/5 border border-transparent"
              )}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" />
              <span className="truncate text-sm">{chat.title}</span>
            </button>
          ))
        )}
      </div>

      {/* Patient Context Form */}
      <div className="p-4 border-t border-gray-700 max-h-[50%] overflow-y-auto">
        <div className="rounded-xl bg-white/5 border border-white/10 p-4 space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-sm font-semibold text-white">Patient Context</h2>
            <p className="text-xs text-gray-400">Set patient details</p>
          </div>

          {savedContext && (
            <div className="p-2 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-xs">
              Context saved!
            </div>
          )}

          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300">Patient Name</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Enter name"
                className={cn(
                  "w-full px-3 py-2 rounded-lg text-sm",
                  "bg-white/5 border border-white/10",
                  "text-white placeholder:text-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50"
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age"
                  className={cn(
                    "w-full px-3 py-2 rounded-lg text-sm",
                    "bg-white/5 border border-white/10",
                    "text-white placeholder:text-gray-500",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50"
                  )}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-300">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className={cn(
                    "w-full px-3 py-2 rounded-lg text-sm",
                    "bg-white/5 border border-white/10",
                    "text-white",
                    "focus:outline-none focus:ring-2 focus:ring-primary/50"
                  )}
                >
                  <option value="" className="text-black">Select</option>
                  <option value="male" className="text-black">Male</option>
                  <option value="female" className="text-black">Female</option>
                  <option value="other" className="text-black">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300">Condition/Disease</label>
              <input
                type="text"
                name="disease"
                value={formData.disease}
                onChange={handleChange}
                placeholder="Enter condition"
                className={cn(
                  "w-full px-3 py-2 rounded-lg text-sm",
                  "bg-white/5 border border-white/10",
                  "text-white placeholder:text-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50"
                )}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300">Symptoms</label>
              <textarea
                name="symptoms"
                value={formData.symptoms}
                onChange={handleChange}
                placeholder="Describe symptoms"
                rows={2}
                className={cn(
                  "w-full px-3 py-2 rounded-lg text-sm",
                  "bg-white/5 border border-white/10",
                  "text-white placeholder:text-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50",
                  "resize-none"
                )}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-gray-300">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
                className={cn(
                  "w-full px-3 py-2 rounded-lg text-sm",
                  "bg-white/5 border border-white/10",
                  "text-white placeholder:text-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50"
                )}
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={isFormEmpty}
            className={cn(
              "w-full py-2 rounded-lg text-sm font-medium transition-all duration-200",
              isFormEmpty 
                ? "bg-gray-600/50 text-gray-400 cursor-not-allowed"
                : "bg-primary hover:bg-primary/90 text-white"
            )}
          >
            Save Context
          </Button>
        </div>
      </div>
    </aside>
  )
}