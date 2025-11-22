'use client';

import { useState, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  Code, 
  Eye, 
  Copy, 
  Download, 
  Check, 
  RefreshCw,
  Bot,
  Layers,
  Palette,
  Github,
  ExternalLink,
  ChevronRight,
  Terminal,
  AlertCircle
} from 'lucide-react';

const examplePrompts = [
  { label: "Login Form", prompt: "A modern glassmorphism login form with email, password, remember me checkbox, and social login buttons" },
  { label: "Pricing Cards", prompt: "Three animated pricing cards with hover effects, featuring Free, Pro, and Enterprise tiers" },
  { label: "Dashboard Widget", prompt: "A stats dashboard card showing revenue, users, and orders with mini sparkline charts" },
  { label: "Navigation Bar", prompt: "A responsive navbar with logo, menu items, dropdown, and mobile hamburger menu" },
  { label: "Hero Section", prompt: "A stunning hero section with gradient text, CTA buttons, and floating animated shapes" },
  { label: "Contact Form", prompt: "A contact form with name, email, message fields, validation states, and submit animation" },
];

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'preview' | 'code'>('preview');
  const [copied, setCopied] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // Generate a blob URL for the iframe to avoid cross-origin issues
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (code) {
      // Create a new blob URL for the HTML content
      const blob = new Blob([code], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      
      // Clean up the blob URL when component unmounts or code changes
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [code, iframeKey]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned an invalid response. Please check if the API route exists.');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate code');
      }

      if (!data.code) {
        throw new Error('No code was generated. Please try again.');
      }

      setCode(data.code);
      setActiveTab('preview');
      setIframeKey(prev => prev + 1);
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCode = () => {
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-component.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleGenerate();
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white">
      <div className="fixed inset-0 bg-linear-to-br from-purple-900/20 via-transparent to-pink-900/20 pointer-events-none" />
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

      <header className="relative border-b border-white/5 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold">CodeForge AI</h1>
                
              </div>
            </div>
            
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-6 py-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Code Generation
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-linear-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
              Transform Ideas into Code
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Describe any UI component and watch it come to life. Generate production-ready 
            HTML, CSS, and JavaScript in seconds.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {[
            { icon: Layers, label: 'Complete Components' },
            { icon: Palette, label: 'Modern Styling' },
            { icon: Terminal, label: 'Clean Code' },
          ].map((feature, i) => (
            <div 
              key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-gray-300"
            >
              <feature.icon className="w-4 h-4 text-purple-400" />
              {feature.label}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/3 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Describe your component
              </label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="E.g., A modern card component with an image, title, description, and a gradient button..."
                className="w-full h-36 px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none transition-all"
                disabled={isLoading}
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-500">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-400">⌘</kbd> + <kbd className="px-1.5 py-0.5 rounded bg-white/10 text-gray-400">Enter</kbd> to generate
                </span>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isLoading || !prompt.trim()}
                className="mt-4 w-full px-6 py-3.5 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 disabled:shadow-none"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Generate Code
                  </>
                )}
              </button>
            </div>

            <div className="bg-white/3 backdrop-blur-sm rounded-2xl border border-white/10 p-6">
              <h3 className="text-sm font-medium text-gray-300 mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-400" />
                Try these examples
              </h3>
              <div className="space-y-2">
                {examplePrompts.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(example.prompt)}
                    disabled={isLoading}
                    className="w-full text-left px-4 py-3 bg-white/2 hover:bg-white/2 border border-white/5 hover:border-purple-500/30 rounded-xl text-sm text-gray-300 transition-all duration-200 flex items-center justify-between group disabled:opacity-50"
                  >
                    <span>{example.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-purple-400 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="bg-white/3 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden h-full">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/20">
                <div className="flex gap-1">
                  <button
                    onClick={() => setActiveTab('preview')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                      activeTab === 'preview'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Eye className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all flex items-center gap-2 ${
                      activeTab === 'code'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Code className="w-4 h-4" />
                    Code
                  </button>
                </div>

                {code && (
                  <div className="flex gap-2">
                    {activeTab === 'preview' && (
                      <button
                        onClick={() => setIframeKey(prev => prev + 1)}
                        className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <RefreshCw className="w-3 h-3" />
                        Refresh
                      </button>
                    )}
                    <button
                      onClick={copyCode}
                      className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadCode}
                      className="px-3 py-1.5 text-xs bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Download className="w-3 h-3" />
                      Download
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <div className="mx-4 mt-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 text-sm flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="h-[600px]">
                {activeTab === 'preview' ? (
                  <div className="h-full p-4">
                    {code && previewUrl ? (
                      <div className="h-full bg-white rounded-xl overflow-hidden shadow-2xl">
                        <iframe
                          key={iframeKey}
                          src={previewUrl}
                          className="w-full h-full"
                          sandbox="allow-scripts allow-modals allow-forms allow-popups"
                          title="Preview"
                        />
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-black/20 rounded-xl border border-dashed border-white/10">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                          <Eye className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="font-medium">No preview yet</p>
                        <p className="text-sm text-gray-600 mt-1">Generate code to see the preview here</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full p-4">
                    {code ? (
                      <textarea
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        className="w-full h-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-green-400 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                        spellCheck={false}
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-gray-500 bg-black/20 rounded-xl border border-dashed border-white/10">
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                          <Code className="w-8 h-8 text-gray-600" />
                        </div>
                        <p className="font-medium">No code yet</p>
                        <p className="text-sm text-gray-600 mt-1">Generated code will appear here</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative border-t border-white/5 mt-16">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              Built with Next.js • Powered by OpenRouter & KwaiPilot Kat-Coder-Pro
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}