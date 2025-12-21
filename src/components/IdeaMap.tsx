import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface IdeaMapProps {
  thesis: string;
  ideas: Array<{
    id: string;
    title: string;
    summary: string;
    actionable_takeaway: string | null;
  }>;
}

export function IdeaMap({ thesis, ideas }: IdeaMapProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
  const [hoveredIdea, setHoveredIdea] = useState<string | null>(null);

  useEffect(() => {
    if (!svgRef.current || !thesis || !ideas.length) return;

    // Clear previous render
    d3.select(svgRef.current).selectAll('*').remove();

    const width = 900;
    const height = 500;
    const centerX = width / 2;
    const centerY = height / 2;

    const svg = d3.select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', `0 0 ${width} ${height}`)
      .style('max-width', '100%')
      .style('height', 'auto');

    const g = svg.append('g');

    // Calculate positions for a clean radial layout
    const angleStep = (2 * Math.PI) / ideas.length;
    const radius = 180;

    // Create node data
    const nodes = [
      { id: 'thesis', label: thesis, x: centerX, y: centerY, isThesis: true, ideaData: null },
      ...ideas.map((idea, i) => ({
        id: idea.id,
        label: idea.title,
        x: centerX + radius * Math.cos(i * angleStep - Math.PI / 2),
        y: centerY + radius * Math.sin(i * angleStep - Math.PI / 2),
        isThesis: false,
        ideaData: idea
      }))
    ];

    // Create link data
    const links = ideas.map((_, i) => ({
      source: nodes[0],
      target: nodes[i + 1]
    }));

    // Draw links with gradient
    const defs = svg.append('defs');
    const gradient = defs.append('linearGradient')
      .attr('id', 'link-gradient')
      .attr('gradientUnits', 'userSpaceOnUse');

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', '#6366f1')
      .attr('stop-opacity', 0.6);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', '#818cf8')
      .attr('stop-opacity', 0.3);

    // Draw edges
    g.selectAll('line')
      .data(links)
      .join('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke', 'url(#link-gradient)')
      .attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4');

    // Draw nodes with text first to calculate bubble sizes
    const nodeGroups = g.selectAll('g.node')
      .data(nodes)
      .join('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    // Text labels with word wrapping (draw first to measure)
    const textData: Array<{ node: any; lines: string[]; width: number; height: number }> = [];

    nodeGroups.each(function(d) {
      const node = d3.select(this);
      const words = d.label.split(' ');
      const maxWidth = d.isThesis ? 140 : 100;
      const lineHeight = 1.2;
      const fontSize = d.isThesis ? 12 : 10;

      let line: string[] = [];
      let lines: string[] = [];
      let testLine = '';

      // Create temporary text element to measure width
      const tempText = node.append('text')
        .style('font-size', `${fontSize}px`)
        .style('font-weight', '500')
        .style('visibility', 'hidden');

      words.forEach(word => {
        testLine = line.concat(word).join(' ');
        tempText.text(testLine);
        const width = (tempText.node() as SVGTextElement).getComputedTextLength();

        if (width > maxWidth && line.length > 0) {
          lines.push(line.join(' '));
          line = [word];
        } else {
          line.push(word);
        }
      });

      if (line.length > 0) {
        lines.push(line.join(' '));
      }

      // Measure max line width
      let maxLineWidth = 0;
      lines.forEach(lineText => {
        tempText.text(lineText);
        const width = (tempText.node() as SVGTextElement).getComputedTextLength();
        maxLineWidth = Math.max(maxLineWidth, width);
      });

      tempText.remove();

      const textHeight = lines.length * fontSize * lineHeight;
      textData.push({
        node: d,
        lines,
        width: maxLineWidth,
        height: textHeight
      });
    });

    // Draw bubble backgrounds with interactivity
    nodeGroups.each(function(d, i) {
      const node = d3.select(this);
      const data = textData[i];
      const padding = d.isThesis ? 20 : 16;
      const bubbleWidth = data.width + padding * 2;
      const bubbleHeight = data.height + padding * 1.5;

      // Rounded rectangle bubble
      const rect = node.insert('rect', ':first-child')
        .attr('x', -bubbleWidth / 2)
        .attr('y', -bubbleHeight / 2)
        .attr('width', bubbleWidth)
        .attr('height', bubbleHeight)
        .attr('rx', d.isThesis ? 24 : 20)
        .attr('ry', d.isThesis ? 24 : 20)
        .attr('fill', d.isThesis ? '#4f46e5' : '#ffffff')
        .attr('stroke', d.isThesis ? '#4338ca' : '#6366f1')
        .attr('stroke-width', d.isThesis ? 3 : 2)
        .style('filter', 'drop-shadow(0px 3px 8px rgba(0,0,0,0.12))')
        .style('cursor', d.isThesis ? 'default' : 'pointer')
        .style('transition', 'all 0.2s ease')
        .attr('opacity', 0);

      // Add hover and click interactions for idea nodes BEFORE transition
      if (!d.isThesis) {
        rect
          .on('mouseover', function() {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('stroke-width', 3)
              .style('filter', 'drop-shadow(0px 6px 16px rgba(99, 102, 241, 0.3))');

            setHoveredIdea(d.id);
          })
          .on('mouseout', function() {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('stroke-width', 2)
              .style('filter', 'drop-shadow(0px 3px 8px rgba(0,0,0,0.12))');

            setHoveredIdea(null);
          })
          .on('click', function() {
            setSelectedIdea(d.id);
          });
      }

      // Animate in after event handlers are set
      rect
        .transition()
        .duration(600)
        .delay(i * 100)
        .attr('opacity', 1);
    });

    // Add text on top of bubbles
    nodeGroups.each(function(d, i) {
      const node = d3.select(this);
      const data = textData[i];
      const fontSize = d.isThesis ? 12 : 10;
      const lineHeight = 1.2;

      const textGroup = node.append('text')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .style('font-size', `${fontSize}px`)
        .style('font-weight', '500')
        .style('fill', d.isThesis ? '#ffffff' : '#1f2937')
        .style('pointer-events', 'none');

      const totalHeight = data.lines.length * fontSize * lineHeight;
      const startY = -totalHeight / 2 + fontSize / 2;

      data.lines.forEach((lineText, j) => {
        textGroup.append('tspan')
          .attr('x', 0)
          .attr('y', startY + j * fontSize * lineHeight)
          .text(lineText);
      });
    });

  }, [thesis, ideas]);

  if (!thesis || !ideas.length) {
    return null;
  }

  const selectedIdeaData = ideas.find(idea => idea.id === selectedIdea || idea.id === hoveredIdea);

  return (
    <div className="my-8">
      <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 rounded-xl border border-slate-200 p-8">
        <div className="text-center mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">Semantic Graph</h3>
          <p className="text-xs text-gray-500">
            Click on any idea to see details
          </p>
        </div>
        <div className="flex justify-center">
          <svg ref={svgRef} className="idea-map"></svg>
        </div>
      </div>

      {/* Detail panel */}
      {selectedIdeaData && (
        <div className="mt-4 bg-white rounded-xl border-2 border-primary-300 p-6 shadow-lg">
          <div className="flex items-start justify-between mb-4">
            <h4 className="text-lg font-semibold text-gray-900 flex-1">
              {selectedIdeaData.title}
            </h4>
            <button
              onClick={() => setSelectedIdea(null)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <h5 className="text-sm font-semibold text-gray-700 mb-2">Summary</h5>
              <div className="text-sm text-gray-600 prose prose-sm max-w-none">
                {selectedIdeaData.summary}
              </div>
            </div>

            {selectedIdeaData.actionable_takeaway && (
              <div>
                <h5 className="text-sm font-semibold text-gray-700 mb-2">Actionable Takeaway</h5>
                <div className="text-sm text-gray-600 prose prose-sm max-w-none">
                  {selectedIdeaData.actionable_takeaway}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
