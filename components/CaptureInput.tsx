import React, { useState, useEffect, useRef } from 'react';
import { Mic, Send, Square, Loader2 } from 'lucide-react';

interface CaptureInputProps {
  onCapture: (text: string) => Promise<void>;
  isProcessing: boolean;
}

const CaptureInput: React.FC<CaptureInputProps> = ({ onCapture, isProcessing }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null); // Type 'any' for Web Speech API to avoid strict type hassle in this context

  useEffect(() => {
    // Check for browser support and initialize
    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setText((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Voice capture not supported in this browser.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isProcessing) return;
    
    const textToSubmit = text;
    setText(''); // Optimistic clear
    await onCapture(textToSubmit);
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8 relative z-20">
      <form onSubmit={handleSubmit} className="relative group">
        <div className={`
          absolute -inset-0.5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl opacity-50 blur transition duration-200
          ${isProcessing ? 'animate-pulse' : 'group-hover:opacity-75'}
        `}></div>
        <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 flex items-center p-2">
          <button
            type="button"
            onClick={toggleListening}
            className={`p-3 rounded-full transition-colors ${
              isListening ? 'bg-red-100 text-red-500 animate-pulse' : 'hover:bg-gray-100 text-gray-500'
            }`}
            title="Voice Capture"
          >
            {isListening ? <Square size={20} fill="currentColor" /> : <Mic size={20} />}
          </button>
          
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Capture a thought..."
            className="flex-1 px-4 py-3 bg-transparent outline-none text-lg text-gray-800 placeholder-gray-400 font-serif"
            disabled={isProcessing}
            autoFocus
          />

          <button
            type="submit"
            disabled={!text.trim() || isProcessing}
            className={`p-3 rounded-full transition-all duration-200 ${
              text.trim() && !isProcessing
                ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-md' 
                : 'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            {isProcessing ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CaptureInput;