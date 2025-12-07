import React from 'react';
import { X, Info } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose
}) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden">
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-serif font-bold text-slate-800 flex items-center">
            About MomentSmith
          </h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full text-gray-500">
            <X size={24} />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          <section className="space-y-4">
             <div className="flex items-center space-x-2 text-slate-800">
                <Info size={20} className="text-blue-500"/>
                <h3 className="text-lg font-semibold">What is this?</h3>
             </div>
             <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 text-slate-700 text-sm leading-relaxed space-y-3">
                <p>
                  <strong>MomentSmith</strong> is a tool for quiet organized chaos. It captures fleeting thoughts, classifies them using AI, and helps you synthesize them into patterns and outputs.
                </p>
                <p>
                  It features an "Algorithm Mirror" designed to reveal how digital systems might interpret and target your cognitive patterns, and a Mind Map to visualize the connections between your ideas.
                </p>
                <p>
                  <strong>Privacy Note:</strong> All data is stored locally in your browser. It is sent to Google Gemini only for processing and is not retained on any external server by this app.
                </p>
             </div>
          </section>

          <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-100">
             MomentSmith v1.1.0 • Built with Google Gemini
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;