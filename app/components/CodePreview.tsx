'use client';

import { RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface CodePreviewProps {
  code: string;
}

export default function CodePreview({ code }: CodePreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [key, setKey] = useState(0);

  useEffect(() => {
    if (iframeRef.current && code) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(code);
        doc.close();
      }
    }
  }, [code, key]);

  const refresh = () => setKey(prev => prev + 1);

  return (
    <div className="flex flex-col h-full bg-slate-800 rounded-xl overflow-hidden border border-slate-700">
      <div className="flex items-center justify-between p-4 bg-slate-900/50 border-b border-slate-700">
        <h3 className="text-white font-semibold">
          Live Preview
        </h3>
        <button
          onClick={refresh}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors text-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="flex-1 overflow-hidden bg-white">
        {code ? (
          <iframe
            key={key}
            ref={iframeRef}
            className="w-full h-full border-none"
            title="Code Preview"
            sandbox="allow-scripts"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Generate code to see preview
          </div>
        )}
      </div>
    </div>
  );
}