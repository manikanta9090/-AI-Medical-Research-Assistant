import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export default function Sidebar() {
  const [formData, setFormData] = useState({
    patientName: '',
    disease: '',
    location: ''
  })
  const [savedContext, setSavedContext] = useState(null)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSave = () => {
    setSavedContext({ ...formData })
    console.log('Context saved:', formData)
  }

  const isFormEmpty = !formData.patientName && !formData.disease && !formData.location

  return (
    <aside className="w-full h-full p-4">
      <div className="relative h-full p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-xl">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold text-white">CuraMind AI</h1>
            <p className="text-sm text-gray-400">AI Medical Research Assistant</p>
          </div>

          {savedContext && (
            <div className="p-3 rounded-lg bg-green-500/20 border border-green-500/30 text-green-400 text-sm">
              Context saved successfully!
            </div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Patient Name</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Enter patient name"
                className={cn(
                  "w-full px-4 py-3 rounded-lg",
                  "bg-white/5 border border-white/10",
                  "text-white placeholder:text-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50",
                  "transition-all duration-200"
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Disease</label>
              <input
                type="text"
                name="disease"
                value={formData.disease}
                onChange={handleChange}
                placeholder="Enter disease or condition"
                className={cn(
                  "w-full px-4 py-3 rounded-lg",
                  "bg-white/5 border border-white/10",
                  "text-white placeholder:text-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50",
                  "transition-all duration-200"
                )}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Enter location"
                className={cn(
                  "w-full px-4 py-3 rounded-lg",
                  "bg-white/5 border border-white/10",
                  "text-white placeholder:text-gray-500",
                  "focus:outline-none focus:ring-2 focus:ring-primary/50",
                  "transition-all duration-200"
                )}
              />
            </div>
          </div>

          <Button
            onClick={handleSave}
            disabled={isFormEmpty}
            className={cn(
              "w-full py-3 rounded-lg font-medium transition-all duration-200",
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