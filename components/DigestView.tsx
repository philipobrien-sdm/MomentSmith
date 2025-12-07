import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Capture } from '../types';
import { generateWeeklyDigest } from '../services/geminiService';
import { Loader2, RefreshCw } from 'lucide-react';

interface DigestViewProps {
  captures: Capture[];
  content: string | null;
  onUpdateContent: (content: string) => void;
}

const DigestView: React.FC<DigestViewProps> = ({ captures, content, onUpdateContent }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateWeeklyDigest(captures);
      onUpdateContent(result);
    } catch (e) {
      // Don't save error messages to the persistent state, just show locally or alert
      alert("Error generating digest. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Auto-generate on first mount if we have data and no existing content
    if (captures.length > 0 && !content) {
        handleGenerate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (captures.length === 0) {
    return (
        <div className="text-center py-20 text-gray-400 font-serif italic">
          "Not enough data to find patterns. Capture more moments."
        </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-24">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif text-slate-800">Weekly Reflection</h2>
            <button 
                onClick={handleGenerate}
                disabled={loading}
                className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-full transition-colors"
            >
                {loading ? <Loader2 className="animate-spin" size={20}/> : <RefreshCw size={20}/>}
            </button>
        </div>

      {loading && !content ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="animate-spin text-slate-400" size={32} />
            <p className="text-slate-500 font-mono text-sm animate-pulse">Consulting the patterns...</p>
        </div>
      ) : (
        <article className="prose prose-slate prose-lg bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <ReactMarkdown
                components={{
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold mt-6 mb-3 text-slate-800 border-b pb-2" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 text-slate-600 leading-relaxed" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1 text-slate-600" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-slate-800" {...props} />
                }}
            >
                {content || ''}
            </ReactMarkdown>
        </article>
      )}
    </div>
  );
};

export default DigestView;