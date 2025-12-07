import React from 'react';
import { Capture, CaptureCategory } from '../types';
import { FileText, MoreHorizontal, Sparkles, Hash } from 'lucide-react';

interface TimelineProps {
  captures: Capture[];
  onGenerateSpec: (capture: Capture) => void;
}

const CategoryColorMap: Record<CaptureCategory, string> = {
  [CaptureCategory.AppIdea]: 'bg-blue-100 text-blue-800',
  [CaptureCategory.Philosophy]: 'bg-purple-100 text-purple-800',
  [CaptureCategory.Parenting]: 'bg-green-100 text-green-800',
  [CaptureCategory.Venting]: 'bg-red-50 text-red-800',
  [CaptureCategory.Technical]: 'bg-slate-100 text-slate-800',
  [CaptureCategory.Networking]: 'bg-orange-100 text-orange-800',
  [CaptureCategory.Absurd]: 'bg-yellow-100 text-yellow-800',
  [CaptureCategory.Other]: 'bg-gray-100 text-gray-800',
};

const Timeline: React.FC<TimelineProps> = ({ captures, onGenerateSpec }) => {
  if (captures.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 font-serif italic">
        "The mind is waiting for a spark."
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-24">
      {captures.map((capture) => (
        <div key={capture.id} className="group relative bg-white p-6 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex justify-between items-start mb-3">
            <span className={`px-2 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${CategoryColorMap[capture.category] || CategoryColorMap[CaptureCategory.Other]}`}>
              {capture.category}
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {new Date(capture.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <p className="text-gray-800 text-lg font-serif leading-relaxed mb-4">
            {capture.text}
          </p>

          {capture.summary && capture.summary !== capture.text && (
             <div className="mb-4 pl-3 border-l-2 border-gray-200 text-sm text-gray-500 italic">
               "{capture.summary}"
             </div>
          )}

          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
            <div className="flex flex-wrap gap-2">
              {capture.tags.map((tag) => (
                <span key={tag} className="flex items-center text-xs text-gray-400">
                  <Hash size={10} className="mr-0.5" />
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
               {capture.category === CaptureCategory.AppIdea && (
                <button
                  onClick={() => onGenerateSpec(capture)}
                  className="flex items-center text-xs font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-2 py-1 rounded"
                >
                  <Sparkles size={12} className="mr-1" />
                  Spec
                </button>
               )}
              <button className="text-gray-400 hover:text-gray-600 p-1">
                <MoreHorizontal size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;