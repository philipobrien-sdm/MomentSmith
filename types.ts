
export enum CaptureCategory {
  AppIdea = 'App Idea',
  Philosophy = 'Philosophy',
  Parenting = 'Parenting',
  Venting = 'Venting',
  Technical = 'Technical',
  Networking = 'Networking Insight',
  Absurd = 'Absurd Observation',
  Other = 'Other',
}

export interface ClassificationResult {
  category: CaptureCategory;
  confidence: number;
  suggested_tags: string[];
  tone: string;
  summary: string;
}

export interface Capture {
  id: string;
  text: string;
  timestamp: number;
  category: CaptureCategory;
  tags: string[];
  tone: string;
  summary: string;
  isProcessing?: boolean;
}

export enum ViewMode {
  Timeline = 'timeline',
  MindMap = 'mindmap',
  Digest = 'digest',
  AlgorithmMirror = 'algorithm_mirror',
}

export interface DigestData {
  summary: string;
  patterns: string;
  actionable: string;
  absurdist: string;
}

// Mind Map Types
export interface MindMapLink {
  source: string;
  target: string;
  label: string; // e.g., "contradicts", "supports", "related to"
  strength: number; // 1-10
  bidirectional: boolean;
}

export interface MindMapNodeMeta {
  id: string;
  significance: number; // 1-10, size of the node
}

export interface MindMapData {
  nodes: MindMapNodeMeta[];
  links: MindMapLink[];
}
