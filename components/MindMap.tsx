
import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Capture, CaptureCategory, MindMapData } from '../types';
import { generateMindMapConnections } from '../services/geminiService';
import { Loader2, Share2, RefreshCw, Maximize } from 'lucide-react';

interface MindMapProps {
  captures: Capture[];
  mapData: MindMapData | null;
  onUpdateMapData: (data: MindMapData) => void;
}

// Extended types for D3 simulation
interface D3Node extends d3.SimulationNodeDatum {
  id: string;
  category: CaptureCategory;
  text: string;
  summary: string;
  significance: number; // 1-10
  width: number;
  height: number;
}

interface D3Link extends d3.SimulationLinkDatum<D3Node> {
  source: string | D3Node;
  target: string | D3Node;
  strength: number;
  bidirectional: boolean;
  label: string;
}

const CategoryColorMap: Record<CaptureCategory, string> = {
  [CaptureCategory.AppIdea]: '#dbeafe', // blue-100
  [CaptureCategory.Philosophy]: '#f3e8ff', // purple-100
  [CaptureCategory.Parenting]: '#dcfce7', // green-100
  [CaptureCategory.Venting]: '#fef2f2', // red-50
  [CaptureCategory.Technical]: '#f1f5f9', // slate-100
  [CaptureCategory.Networking]: '#ffedd5', // orange-100
  [CaptureCategory.Absurd]: '#fef9c3', // yellow-100
  [CaptureCategory.Other]: '#f3f4f6', // gray-100
};

const CategoryBorderMap: Record<CaptureCategory, string> = {
  [CaptureCategory.AppIdea]: '#93c5fd', // blue-300
  [CaptureCategory.Philosophy]: '#d8b4fe', // purple-300
  [CaptureCategory.Parenting]: '#86efac', // green-300
  [CaptureCategory.Venting]: '#fca5a5', // red-300
  [CaptureCategory.Technical]: '#cbd5e1', // slate-300
  [CaptureCategory.Networking]: '#fdba74', // orange-300
  [CaptureCategory.Absurd]: '#fde047', // yellow-300
  [CaptureCategory.Other]: '#d1d5db', // gray-300
};

const MindMap: React.FC<MindMapProps> = ({ captures, mapData, onUpdateMapData }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<D3Node | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  const handleGenerateMap = async () => {
    setIsGenerating(true);
    try {
        const data = await generateMindMapConnections(captures);
        onUpdateMapData(data);
    } catch (e) {
        alert("Could not generate map connections.");
    } finally {
        setIsGenerating(false);
    }
  };

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !mapData) return;
    if (captures.length === 0) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // Clear previous
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // 1. Prepare Data for D3
    // Merge existing captures with AI significance data
    const d3Nodes: D3Node[] = captures.map(c => {
        const meta = mapData.nodes.find(n => n.id === c.id);
        const sig = meta ? meta.significance : 5;
        // Rectangular dimensions based on significance
        const nodeWidth = 100 + (sig * 8); 
        const nodeHeight = 50 + (sig * 4);
        
        return {
            id: c.id,
            category: c.category,
            text: c.text,
            summary: c.summary,
            significance: sig,
            width: nodeWidth,
            height: nodeHeight,
            // Initial random positions near center
            x: width/2 + (Math.random() - 0.5) * 50,
            y: height/2 + (Math.random() - 0.5) * 50
        };
    });

    const d3Links: D3Link[] = mapData.links.map(l => ({
        source: l.source,
        target: l.target,
        strength: l.strength,
        bidirectional: l.bidirectional,
        label: l.label
    })).filter(l => {
        const sourceId = typeof l.source === 'object' ? (l.source as any).id : l.source;
        const targetId = typeof l.target === 'object' ? (l.target as any).id : l.target;
        return d3Nodes.find(n => n.id === sourceId) && d3Nodes.find(n => n.id === targetId);
    });

    // 2. Run Simulation invisibly (Static Layout)
    const simulation = d3.forceSimulation(d3Nodes)
        .force("link", d3.forceLink(d3Links).id((d: any) => d.id).distance(180)) // Increased distance for rects
        .force("charge", d3.forceManyBody().strength(-800)) // Stronger repulsion for rects
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force("collide", d3.forceCollide().radius((d: any) => Math.max(d.width, d.height) * 0.7).iterations(3)); // Collision based on approximate radius
    
    // Warm up the simulation
    simulation.stop();
    for (let i = 0; i < 300; ++i) simulation.tick();

    // 3. Render Static SVG
    const g = svg.append("g");

    // Define Arrow Marker
    svg.append("defs").append("marker")
        .attr("id", "arrowhead")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", 10) // Will need dynamic adjustment or use separate markers, keeping simple for now
        .attr("refY", 0)
        .attr("markerWidth", 8)
        .attr("markerHeight", 8)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "#94a3b8");

    // Zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });
    
    svg.call(zoom);

    // --- ZOOM TO FIT LOGIC ---
    if (d3Nodes.length > 0) {
      const padding = 60;
      const minX = d3.min(d3Nodes, d => (d.x || 0) - d.width/2) || 0;
      const maxX = d3.max(d3Nodes, d => (d.x || 0) + d.width/2) || 0;
      const minY = d3.min(d3Nodes, d => (d.y || 0) - d.height/2) || 0;
      const maxY = d3.max(d3Nodes, d => (d.y || 0) + d.height/2) || 0;

      const boundsWidth = maxX - minX;
      const boundsHeight = maxY - minY;

      const scale = Math.min(
        (width - padding * 2) / boundsWidth,
        (height - padding * 2) / boundsHeight
      );
      
      const finalScale = Math.min(Math.max(scale, 0.2), 1.5); // Clamp scale
      
      const midX = (minX + maxX) / 2;
      const midY = (minY + maxY) / 2;
      
      const translateX = width / 2 - midX * finalScale;
      const translateY = height / 2 - midY * finalScale;

      const initialTransform = d3.zoomIdentity
        .translate(translateX, translateY)
        .scale(finalScale);

      svg.call(zoom.transform, initialTransform);
    }
    // -------------------------

    // Render Links
    g.selectAll(".link")
        .data(d3Links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr("stroke", "#cbd5e1")
        .attr("stroke-width", (d) => d.strength)
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

    // Render Nodes (Rectangles)
    const nodeGroups = g.selectAll(".node")
        .data(d3Nodes)
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("transform", (d) => `translate(${d.x},${d.y})`)
        .style("cursor", "pointer")
        .on("mouseenter", (event, d) => {
            // Calculate screen position for tooltip
            const svgRect = svgRef.current?.getBoundingClientRect();
            if (svgRect) {
               // Use the transformed coordinates from the zoom transform if needed, 
               // but for a fixed overlay, simple event client coordinates are easier 
               // relative to the container.
               const containerRect = containerRef.current?.getBoundingClientRect();
               if(containerRect) {
                   setTooltipPos({
                       x: event.clientX - containerRect.left,
                       y: event.clientY - containerRect.top
                   });
               }
            }
            setHoveredNode(d);
            
            // Highlight node
            d3.select(event.currentTarget).select("rect")
              .attr("stroke", "#1e293b")
              .attr("stroke-width", 3);
        })
        .on("mouseleave", (event, d) => {
            setHoveredNode(null);
            // Reset highlight
            d3.select(event.currentTarget).select("rect")
              .attr("stroke", CategoryBorderMap[d.category] || "#94a3b8")
              .attr("stroke-width", d.significance > 7 ? 2 : 1);
        });

    nodeGroups.append("rect")
        .attr("x", (d) => -d.width / 2)
        .attr("y", (d) => -d.height / 2)
        .attr("width", (d) => d.width)
        .attr("height", (d) => d.height)
        .attr("rx", 8) // Rounded corners
        .attr("ry", 8)
        .attr("fill", (d) => CategoryColorMap[d.category] || '#eee')
        .attr("stroke", (d) => CategoryBorderMap[d.category] || "#94a3b8")
        .attr("stroke-width", (d) => d.significance > 7 ? 2 : 1)
        .attr("filter", "drop-shadow(0px 2px 2px rgba(0,0,0,0.05))"); // Subtle shadow

    // Text Label inside Node
    nodeGroups.append("foreignObject")
      .attr("x", (d) => -d.width / 2)
      .attr("y", (d) => -d.height / 2)
      .attr("width", (d) => d.width)
      .attr("height", (d) => d.height)
      .style("pointer-events", "none")
      .append("xhtml:div")
      .style("width", "100%")
      .style("height", "100%")
      .style("display", "flex")
      .style("align-items", "center")
      .style("justify-content", "center")
      .style("font-size", (d) => Math.min(13, Math.max(10, d.width / 12)) + "px")
      .style("text-align", "center")
      .style("padding", "8px")
      .style("color", "#1e293b")
      .style("line-height", "1.2")
      .html((d) => `<span class="line-clamp-3">${d.summary}</span>`);
    
    // Cleanup
    return () => {
        // No running simulation to stop
    };
  }, [mapData, captures]);

  if (captures.length < 2) {
      return (
          <div className="h-full flex items-center justify-center text-gray-400 font-serif italic p-8 text-center">
              Record at least two thoughts to generate a connected map.
          </div>
      );
  }

  return (
    <div className="flex flex-col h-[650px] bg-white rounded-lg border border-gray-100 shadow-sm relative overflow-hidden group">
        
        {/* Toolbar */}
        <div className="absolute top-4 left-4 z-10 flex flex-col space-y-2">
            {!mapData && !isGenerating && (
                <div className="bg-white/90 backdrop-blur p-4 rounded-lg shadow-lg border border-blue-100 max-w-xs">
                    <h3 className="text-sm font-bold text-slate-800 mb-1">Generate Connections</h3>
                    <p className="text-xs text-slate-500 mb-3">
                        Use AI to analyze your thoughts, find hidden links, and determine which ideas carry the most weight.
                    </p>
                    <button 
                        onClick={handleGenerateMap}
                        className="w-full flex items-center justify-center space-x-2 bg-slate-800 text-white py-2 rounded text-xs hover:bg-slate-900 transition-colors"
                    >
                        <Share2 size={14} />
                        <span>Analyze & Connect</span>
                    </button>
                </div>
            )}

            {mapData && (
                 <button 
                    onClick={handleGenerateMap}
                    disabled={isGenerating}
                    className="flex items-center space-x-2 bg-white/90 backdrop-blur px-3 py-2 rounded border border-gray-200 text-xs text-slate-600 hover:text-slate-900 hover:border-gray-300 transition-all shadow-sm w-fit"
                 >
                    <RefreshCw size={14} className={isGenerating ? "animate-spin" : ""} />
                    <span>Regenerate Graph</span>
                 </button>
            )}
        </div>

        {/* Tooltip Overlay */}
        {hoveredNode && (
            <div 
                className="absolute z-50 bg-slate-800 text-white p-4 rounded-lg shadow-xl max-w-xs pointer-events-none transition-opacity duration-200"
                style={{
                    left: tooltipPos.x, 
                    top: tooltipPos.y,
                    transform: 'translate(-50%, -100%) translateY(-12px)' // Center above cursor
                }}
            >
                <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-700">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{hoveredNode.category}</span>
                    <span className="text-xs text-slate-500">Significance: {hoveredNode.significance}/10</span>
                </div>
                <p className="font-serif text-sm leading-relaxed text-slate-100">
                    {hoveredNode.text}
                </p>
            </div>
        )}

        {/* Legend / Info */}
        {mapData && (
             <div className="absolute top-4 right-4 z-10 bg-white/90 backdrop-blur px-3 py-2 rounded text-xs text-slate-500 border border-slate-100 shadow-sm text-right">
                <div className="mb-1"><strong className="text-slate-700">Rect Size:</strong> Significance</div>
                <div><strong className="text-slate-700">Links:</strong> Semantic Relation</div>
            </div>
        )}

        {/* Loading State */}
        {isGenerating && (
            <div className="absolute inset-0 z-20 bg-white/50 backdrop-blur-sm flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <Loader2 className="animate-spin text-slate-800 mb-2" size={32} />
                    <span className="text-sm font-serif text-slate-600">Mapping the neural pathways...</span>
                </div>
            </div>
        )}

        {/* The SVG Graph */}
        <div ref={containerRef} className="flex-1 w-full h-full bg-slate-50/30">
             <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing"></svg>
        </div>
    </div>
  );
};

export default MindMap;
