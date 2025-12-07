import React, { useState, useEffect, useRef } from 'react';
import { Capture, ViewMode, MindMapData } from './types';
import { classifyThought, generateAppSpec } from './services/geminiService';
import { DEMO_PERSONAS } from './utils/demoData';
import { exportJSON, exportHTML } from './utils/dataHandlers';
import CaptureInput from './components/CaptureInput';
import Timeline from './components/Timeline';
import MindMap from './components/MindMap';
import DigestView from './components/DigestView';
import AlgorithmMirrorView from './components/AlgorithmMirrorView';
import SettingsModal from './components/SettingsModal';
import ConfirmationModal from './components/ConfirmationModal';
import { LayoutGrid, List, Activity, X, Eye, Download, Upload, FileText, Users, Trash2, Info, ChevronDown, Code, Coffee, Plane } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const App: React.FC = () => {
  const [captures, setCaptures] = useState<Capture[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Timeline);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalContent, setModalContent] = useState<string | null>(null);
  
  // Persistent Content States
  const [digestContent, setDigestContent] = useState<string | null>(null);
  const [algorithmContent, setAlgorithmContent] = useState<string | null>(null);
  const [mindMapData, setMindMapData] = useState<MindMapData | null>(null);

  // Modal States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isDemoMenuOpen, setIsDemoMenuOpen] = useState(false);
  
  // Demo loading state
  const [pendingDemoId, setPendingDemoId] = useState<string | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const demoMenuRef = useRef<HTMLDivElement>(null);

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem('momentsmith_captures');
    if (saved) {
      try {
        setCaptures(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load captures", e);
      }
    }
  }, []);

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('momentsmith_captures', JSON.stringify(captures));
  }, [captures]);

  // Click outside listener for Demo Menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (demoMenuRef.current && !demoMenuRef.current.contains(event.target as Node)) {
        setIsDemoMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear analysis content when captures are reset
  useEffect(() => {
    if (captures.length === 0) {
      setDigestContent(null);
      setAlgorithmContent(null);
      setMindMapData(null);
    }
  }, [captures]);

  const handleCapture = async (text: string) => {
    setIsProcessing(true);
    try {
      const tempId = Date.now().toString();
      const classification = await classifyThought(text);

      const newCapture: Capture = {
        id: tempId,
        text,
        timestamp: Date.now(),
        category: classification.category,
        tags: classification.suggested_tags,
        tone: classification.tone,
        summary: classification.summary
      };

      setCaptures(prev => [newCapture, ...prev]);
    } catch (error) {
      console.error("Capture failed:", error);
      alert("Failed to process thought. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleGenerateSpec = async (capture: Capture) => {
    setModalContent("Generating App Spec... this may take a moment.");
    try {
      const spec = await generateAppSpec(capture);
      setModalContent(spec);
    } catch (e) {
      setModalContent("Failed to generate spec.");
    }
  };

  // Data Management Handlers
  const handleLoadDemoRequest = (personaId: string) => {
    setPendingDemoId(personaId);
    setIsDemoMenuOpen(false);
  };

  const performLoadDemo = () => {
    if (!pendingDemoId) return;

    const persona = DEMO_PERSONAS[pendingDemoId];
    if (!persona) return;

    // Shift timestamps of demo data to be recent relative to now
    const adjustedDemoData = persona.captures.map(c => ({
      ...c,
      timestamp: c.timestamp 
    }));
    
    setCaptures(adjustedDemoData);
    setDigestContent(persona.digest);
    setAlgorithmContent(persona.algorithm);
    setMindMapData(persona.mindMap);
    
    setPendingDemoId(null);
  };

  const handleResetData = () => {
    setCaptures([]);
    setDigestContent(null);
    setAlgorithmContent(null);
    setMindMapData(null);
    localStorage.removeItem('momentsmith_captures');
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            setCaptures(parsed);
            // Optional: reset derived state or try to restore it if saved? 
            // For now, reset derived to force re-generation or fresh state
            setDigestContent(null);
            setAlgorithmContent(null);
            setMindMapData(null);
            alert("Data imported successfully.");
          } else {
            alert("Invalid JSON format. Expected an array of captures.");
          }
        } catch (err) {
          alert("Error parsing JSON file.");
        }
      };
      reader.readAsText(file);
    }
    // Reset input
    if (event.target) event.target.value = '';
  };

  return (
    <div className="min-h-screen bg-paper font-sans text-ink selection:bg-slate-200">
      {/* Hidden File Input */}
      <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept=".json" 
          className="hidden" 
      />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-paper/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          
          {/* Left: Brand & View Nav */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setViewMode(ViewMode.Timeline)}>
                <div className="w-6 h-6 bg-slate-800 rounded-sm"></div>
                <h1 className="font-serif font-bold text-xl tracking-tight text-slate-850 hidden sm:block">MomentSmith</h1>
            </div>

            <nav className="flex items-center bg-gray-100/50 p-1 rounded-full">
              <button 
                onClick={() => setViewMode(ViewMode.Timeline)}
                className={`p-2 rounded-full transition-all ${viewMode === ViewMode.Timeline ? 'bg-white shadow-sm text-slate-800' : 'text-gray-400 hover:text-gray-600'}`}
                title="Timeline"
              >
                <List size={18} />
              </button>
              <button 
                onClick={() => setViewMode(ViewMode.MindMap)}
                className={`p-2 rounded-full transition-all ${viewMode === ViewMode.MindMap ? 'bg-white shadow-sm text-slate-800' : 'text-gray-400 hover:text-gray-600'}`}
                title="Mind Map"
              >
                <Activity size={18} />
              </button>
              <button 
                onClick={() => setViewMode(ViewMode.Digest)}
                className={`p-2 rounded-full transition-all ${viewMode === ViewMode.Digest ? 'bg-white shadow-sm text-slate-800' : 'text-gray-400 hover:text-gray-600'}`}
                title="Weekly Digest"
              >
                <LayoutGrid size={18} />
              </button>
              <button 
                onClick={() => setViewMode(ViewMode.AlgorithmMirror)}
                className={`p-2 rounded-full transition-all ${viewMode === ViewMode.AlgorithmMirror ? 'bg-white shadow-sm text-slate-900' : 'text-gray-400 hover:text-gray-600'}`}
                title="Algorithm Mirror"
              >
                <Eye size={18} />
              </button>
            </nav>
          </div>
          
          {/* Right: Actions */}
          <div className="flex items-center space-x-1 sm:space-x-2">
             
             {/* Demo Dropdown */}
             <div className="relative" ref={demoMenuRef}>
                <button 
                    onClick={() => setIsDemoMenuOpen(!isDemoMenuOpen)}
                    className={`flex items-center space-x-1 px-3 py-1.5 rounded-full transition-colors border text-xs font-medium ${isDemoMenuOpen ? 'bg-slate-100 border-slate-300 text-slate-900' : 'bg-white border-gray-200 text-slate-600 hover:bg-gray-50'}`}
                    title="Load Demo Persona"
                >
                    <Users size={14} />
                    <span className="hidden sm:inline">Demos</span>
                    <ChevronDown size={12} />
                </button>

                {isDemoMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-[60] overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                        <div className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Persona</div>
                        <button onClick={() => handleLoadDemoRequest('techie-newborn')} className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-blue-700 flex items-center space-x-3 transition-colors group">
                            <Code size={16} className="text-gray-400 group-hover:text-blue-500"/>
                            <span className="text-sm">Exhausted Optimizer</span>
                        </button>
                        <button onClick={() => handleLoadDemoRequest('stressed-admin')} className="w-full text-left px-4 py-2 hover:bg-red-50 hover:text-red-700 flex items-center space-x-3 transition-colors group">
                            <Coffee size={16} className="text-gray-400 group-hover:text-red-500"/>
                            <span className="text-sm">Overwhelmed Juggler</span>
                        </button>
                        <button onClick={() => handleLoadDemoRequest('nomad-avoidant')} className="w-full text-left px-4 py-2 hover:bg-amber-50 hover:text-amber-700 flex items-center space-x-3 transition-colors group">
                            <Plane size={16} className="text-gray-400 group-hover:text-amber-500"/>
                            <span className="text-sm">Untethered Avoider</span>
                        </button>
                    </div>
                )}
             </div>

             <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block"></div>

             {/* File Actions Group */}
             <div className="flex items-center bg-white border border-gray-200 rounded-full p-0.5">
                <button 
                    onClick={() => exportHTML(captures, digestContent, algorithmContent)}
                    className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    title="Export Report (HTML)"
                >
                    <FileText size={16} />
                </button>
                <div className="w-px h-4 bg-gray-100 mx-0.5"></div>
                <button 
                    onClick={() => exportJSON(captures)}
                    className="p-2 text-slate-600 hover:text-green-600 hover:bg-green-50 rounded-full transition-colors"
                    title="Save Backup (JSON)"
                >
                    <Download size={16} />
                </button>
                <button 
                    onClick={handleImportClick}
                    className="p-2 text-slate-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-colors"
                    title="Load Backup (JSON)"
                >
                    <Upload size={16} />
                </button>
             </div>

             <div className="w-px h-6 bg-gray-200 mx-2 hidden sm:block"></div>

             {/* Reset / About */}
             <button 
                 onClick={() => setIsResetConfirmOpen(true)}
                 className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors"
                 title="Reset All Data"
             >
                 <Trash2 size={18} />
             </button>

            <button 
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                title="About"
            >
                <Info size={18} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Always show input on Timeline view for quick access */}
        {viewMode === ViewMode.Timeline && (
          <CaptureInput onCapture={handleCapture} isProcessing={isProcessing} />
        )}

        {viewMode === ViewMode.Timeline && (
          <Timeline captures={captures} onGenerateSpec={handleGenerateSpec} />
        )}

        {viewMode === ViewMode.MindMap && (
          <div className="animate-in fade-in duration-300">
             <h2 className="text-2xl font-serif mb-6 text-slate-800">Mind Map</h2>
             <MindMap 
                captures={captures} 
                mapData={mindMapData}
                onUpdateMapData={setMindMapData}
             />
          </div>
        )}

        {viewMode === ViewMode.Digest && (
           <div className="animate-in fade-in duration-300">
             <DigestView 
                captures={captures} 
                content={digestContent} 
                onUpdateContent={setDigestContent} 
             />
           </div>
        )}

        {viewMode === ViewMode.AlgorithmMirror && (
           <div className="animate-in fade-in duration-300">
             <AlgorithmMirrorView 
                captures={captures} 
                content={algorithmContent} 
                onUpdateContent={setAlgorithmContent} 
             />
           </div>
        )}
      </main>

      {/* App Spec Modal */}
      {modalContent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h3 className="font-semibold text-slate-800">Output Generator</h3>
              <button onClick={() => setModalContent(null)} className="p-1 hover:bg-gray-100 rounded-full">
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <div className="p-8 overflow-y-auto prose prose-slate">
               <ReactMarkdown>{modalContent}</ReactMarkdown>
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
               <button 
                 onClick={() => { navigator.clipboard.writeText(modalContent); alert("Copied to clipboard"); }}
                 className="px-4 py-2 bg-slate-800 text-white rounded-md text-sm font-medium hover:bg-slate-900"
               >
                 Copy Markdown
               </button>
            </div>
          </div>
        </div>
      )}

      {/* About Modal (Formerly Settings) */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)}
      />

      {/* Reset Confirmation Modal */}
      <ConfirmationModal 
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleResetData}
        title="Delete All Data?"
        message="This action cannot be undone. This will permanently delete all your captured thoughts and insights from your local storage."
        confirmLabel="Yes, Delete Everything"
      />

      {/* Demo Load Confirmation Modal */}
      <ConfirmationModal 
        isOpen={!!pendingDemoId}
        onClose={() => setPendingDemoId(null)}
        onConfirm={performLoadDemo}
        title="Load Demo Persona?"
        message="This will replace your current view with a specific persona. It's a great way to see how the analysis engine works. (Your existing data will be replaced!)"
        confirmLabel="Load Persona"
      />
    </div>
  );
};

export default App;