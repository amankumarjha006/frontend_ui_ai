'use client'

import { useState } from 'react'
import { Code, Eye } from 'lucide-react'
import PromptInput from './PromptInput'
import CodeEditor from './CodeEditor'
import CodePreview from './CodePreview'

export default function CodeGenerator() {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview')

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      })

      const data = await response.json()

      if (!response.ok) throw new Error(data.error || 'Failed to generate code')

      setCode(data.code)
      setActiveTab('preview')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full h-screen bg-slate-900 text-white p-6 flex gap-6">
      
      {/* Input Section */}
      <div className="w-1/3 bg-slate-800 rounded-xl p-4">
        <h2 className="text-lg font-semibold mb-3">Generate UI Code</h2>
        <PromptInput onGenerate={handleGenerate} isLoading={isLoading} />
      </div>

      {/* Output Section */}
      <div className="flex-1 bg-slate-800 rounded-xl p-4 flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">AI Code Generator</h2>
          <p className="text-sm text-purple-400">
            Powered by Kat-Coder-Pro via OpenRouter
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-3">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              activeTab === 'preview'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <Eye size={18} />
            Preview
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
              activeTab === 'code'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-700 hover:bg-slate-600'
            }`}
          >
            <Code size={18} />
            Code
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="text-red-500 bg-red-900/30 p-2 rounded mb-3">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-auto border border-slate-700 rounded-lg">
          {activeTab === 'preview' ? (
            <CodePreview code={code} />
          ) : (
            <CodeEditor code={code} onChange={setCode} />
          )}
        </div>
      </div>
    </div>
  )
}
