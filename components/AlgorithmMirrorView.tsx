
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Capture } from '../types';
import { generateAlgorithmAnalysis } from '../services/geminiService';
import { Loader2, Eye, Fingerprint, Lock, Sparkles } from 'lucide-react';

interface AlgorithmMirrorViewProps {
  captures: Capture[];
  content: string | null;
  onUpdateContent: (content: string) => void;
}

const AlgorithmMirrorView: React.FC<AlgorithmMirrorViewProps> = ({ captures, content, onUpdateContent }) => {
  const [loading, setLoading] = useState(false);
  
  // If we have content passed in, we consider it revealed
  const hasRevealed = !!content;

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await generateAlgorithmAnalysis(captures);
      onUpdateContent(result);
    } catch (e) {
       alert("The mirror is clouded. Connection error.");
    } finally {
      setLoading(false);
    }
  };

  if (captures.length < 3) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-6">
            <Lock className="text-slate-400" size={32} />
        </div>
        <h2 className="text-2xl font-serif text-slate-800 mb-3">Reflection requires data</h2>
        <p className="text-slate-500">
          To see yourself clearly, we need a few more pieces of the puzzle. Capture at least 3 thoughts.
        </p>
      </div>
    );
  }

  if (!hasRevealed && !loading) {
    return (
      <div className="max-w-2xl mx-auto py-20 px-6 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-900 mb-8 shadow-xl ring-4 ring-slate-100">
            <Sparkles className="text-white" size={40} />
        </div>
        <h2 className="text-3xl font-serif text-slate-900 mb-4">The Mirror of Truth</h2>
        <p className="text-slate-600 mb-8 leading-relaxed max-w-lg mx-auto">
          A gentle, unflinching reflection of how the digital world sees you.
          <br/><br/>
          Spoken from a place of radical self-honesty, this analysis reveals the mechanics of how your attention is harvested, your insecurities are targeted, and your reality is shaped.
        </p>
        <p className="text-xs text-slate-400 uppercase tracking-widest mb-8">
            Compassionate • Unflinching • True
        </p>
        <button 
          onClick={handleGenerate}
          className="px-8 py-4 bg-slate-900 text-white rounded-lg font-medium hover:bg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center mx-auto"
        >
          <Fingerprint className="mr-2" size={20}/>
          Reveal the Algorithmic Gaze
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-8">
         <h2 className="text-2xl font-serif text-slate-900 flex items-center">
            <Eye className="mr-3 text-slate-800" size={24}/>
            System Analysis
         </h2>
         {hasRevealed && !loading && (
             <button onClick={handleGenerate} className="text-sm text-slate-500 hover:text-slate-800 underline">
                 Reflect Again
             </button>
         )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-6">
            <div className="relative">
                <div className="absolute inset-0 bg-slate-200 rounded-full animate-ping opacity-25"></div>
                <Loader2 className="animate-spin text-slate-800 relative z-10" size={48} />
            </div>
            <div className="text-center space-y-1">
                <p className="text-slate-800 font-mono text-sm">Consulting your higher self...</p>
                <p className="text-slate-500 text-xs">Seeing through the noise...</p>
            </div>
        </div>
      ) : (
        <article className="prose prose-slate prose-lg bg-slate-50 p-8 rounded-xl shadow-inner border border-slate-200">
            <ReactMarkdown
                components={{
                    h2: ({node, ...props}) => <h2 className="text-xl font-bold uppercase tracking-wider text-slate-900 mt-8 mb-4 border-b border-slate-200 pb-2" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-lg font-bold text-slate-800 mt-8 mb-2" {...props} />,
                    p: ({node, ...props}) => <p className="mb-4 text-slate-700 leading-relaxed font-sans" {...props} />,
                    li: ({node, ...props}) => <li className="mb-2 text-slate-700 list-disc ml-4" {...props} />,
                    strong: ({node, ...props}) => <strong className="font-semibold text-slate-900 bg-slate-200 px-1 rounded-sm" {...props} />
                }}
            >
                {content || ''}
            </ReactMarkdown>
        </article>
      )}
    </div>
  );
};

export default AlgorithmMirrorView;
