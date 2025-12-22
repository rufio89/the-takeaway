import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

    // Draw edges
    g.selectAll('line')
      .data(links)
      .join('line')
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y)
      .attr('stroke', '#d1d5db')
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '2,3');

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
        .attr('rx', d.isThesis ? 0 : 0)
        .attr('ry', d.isThesis ? 0 : 0)
        .attr('fill', d.isThesis ? '#1f2937' : '#ffffff')
        .attr('stroke', d.isThesis ? '#1f2937' : '#d1d5db')
        .attr('stroke-width', d.isThesis ? 2 : 1)
        .style('filter', 'none')
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
              .attr('stroke', '#6b7280')
              .attr('stroke-width', 2);

            setHoveredIdea(d.id);
          })
          .on('mouseout', function() {
            d3.select(this)
              .transition()
              .duration(200)
              .attr('stroke', '#d1d5db')
              .attr('stroke-width', 1);

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
      <div className="bg-white border border-gray-200 p-8">
        <div className="text-center mb-8">
          <h3 className="text-sm font-serif text-gray-900 mb-1">Semantic Graph</h3>
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
        <div className="mt-4 bg-white border border-gray-300 p-6">
          <div className="flex items-start justify-between mb-4 pb-4 border-b border-gray-200">
            <h4 className="text-xl font-serif text-gray-900 flex-1 leading-tight">
              {selectedIdeaData.title}
            </h4>
            <button
              onClick={() => setSelectedIdea(null)}
              className="text-gray-400 hover:text-gray-900 transition-colors ml-4"
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h5 className="text-xs uppercase tracking-wider text-gray-500 mb-3">Summary</h5>
              <div className="notion-content prose prose-sm max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    p: ({ children }) => (
                      <p className="text-sm leading-relaxed mb-3 text-gray-700 font-light">{children}</p>
                    ),
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-900">{children}</strong>
                    ),
                    em: ({ children }) => (
                      <em className="italic">{children}</em>
                    ),
                  }}
                >
                  {selectedIdeaData.summary}
                </ReactMarkdown>
              </div>
            </div>

            {selectedIdeaData.actionable_takeaway && (
              <div className="pt-6 border-t border-gray-200">
                <h5 className="text-xs uppercase tracking-wider text-gray-500 mb-3">Actionable Takeaway</h5>
                <div className="notion-content prose prose-sm max-w-none">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ children }) => (
                        <p className="text-sm leading-relaxed mb-3 text-gray-700 font-light">{children}</p>
                      ),
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">{children}</strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic">{children}</em>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-5 space-y-1 text-sm text-gray-700">{children}</ol>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">{children}</ul>
                      ),
                      li: ({ children }) => (
                        <li className="text-sm text-gray-700 font-light">{children}</li>
                      ),
                    }}
                  >
                    {selectedIdeaData.actionable_takeaway}
                  </ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
