"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { motion } from "motion/react";
import { useResizeObserver } from "@/hooks/use-resize-observer";

interface Skill {
  name: string;
  category: string;
  related: string[];
  projects: number;
  yearsOfExperience: number;
}

const skills = [
  {
    name: "TypeScript",
    category: "Languages",
    related: ["React", "Next.js", "Node.js"],
    projects: 45,
    yearsOfExperience: 5
  },
  {
    name: "React",
    category: "Frameworks",
    related: ["TypeScript", "Next.js", "GraphQL"],
    projects: 40,
    yearsOfExperience: 5
  },
  {
    name: "Next.js",
    category: "Frameworks",
    related: ["React", "TypeScript", "Vercel"],
    projects: 35,
    yearsOfExperience: 4
  },
  {
    name: "Node.js",
    category: "Frameworks",
    related: ["TypeScript", "GraphQL", "Docker"],
    projects: 30,
    yearsOfExperience: 5
  },
  {
    name: "GraphQL",
    category: "Technologies",
    related: ["React", "Node.js", "TypeScript"],
    projects: 25,
    yearsOfExperience: 4
  },
  {
    name: "Docker",
    category: "Tools",
    related: ["Node.js", "AWS", "Vercel"],
    projects: 20,
    yearsOfExperience: 3
  },
  {
    name: "AWS",
    category: "Platforms",
    related: ["Docker", "Node.js", "WordPress"],
    projects: 25,
    yearsOfExperience: 4
  },
  {
    name: "Vercel",
    category: "Platforms",
    related: ["Next.js", "React", "TypeScript"],
    projects: 30,
    yearsOfExperience: 3
  }
] satisfies Skill[];

// Create a type for our D3 node with x and y coordinates
interface SimulationNode extends d3.SimulationNodeDatum {
  name: string;
  category: string;
  related: string[];
  projects: number;
  yearsOfExperience: number;
  x: number;
  y: number;
}

// Create a type for our D3 link with source and target
interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
  source: SimulationNode;
  target: SimulationNode;
}

export function SkillsVisualization() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);

  const simulationRef = useRef<d3.Simulation<
    SimulationNode,
    SimulationLink
  > | null>(null);

  const { width, height } = useResizeObserver(containerRef);

  useEffect(() => {
    if (!svgRef.current || simulationRef.current) return;

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3
      .select(svgRef.current)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height]);

    const nodes = skills.map(skill => ({
      ...skill,
      x: width / 2 + (Math.random() - 0.5) * 100,
      y: height / 2 + (Math.random() - 0.5) * 100
    })) satisfies SimulationNode[];

    const nodeMap = new Map<string, SimulationNode>(
      nodes.map(node => [node.name, node])
    );

    // Create links array with proper typing, ensuring all references exist
    const links = Array.of<SimulationLink>();

    nodes.forEach(node => {
      node.related.forEach(relatedName => {
        const target = nodeMap.get(relatedName);
        if (target) {
          links.push({
            source: node,
            target: target
          });
        }
      });
    });

    // Create force simulation
    const simulation = d3
      .forceSimulation<SimulationNode>(nodes)
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60))
      .force(
        "link",
        d3.forceLink<SimulationNode, SimulationLink>(links).id(d => d.name)
      );

    simulationRef.current = simulation;

    // Add links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#4b5563")
      .attr("stroke-opacity", 0.2)
      .attr("stroke-width", 1);

    // Create groups for each node
    const node = svg
      .append("g")
      .selectAll<SVGGElement, SimulationNode>("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .on("mouseover", function (_event, d) {
        setSelectedSkill(d);
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", 35);
      })
      .on("mouseout", function (_event) {
        setSelectedSkill(null);
        d3.select(this)
          .select("circle")
          .transition()
          .duration(200)
          .attr("r", 30);
      })
      .call(
        d3
          .drag<SVGGElement, SimulationNode>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    // Add circles to nodes
    node
      .append("circle")
      .attr("r", 30)
      .attr("fill", d => getColorForCategory(d.category as keyof typeof colors))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2);

    // Add text labels
    node
      .append("text")
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "#fff")
      .attr("font-size", "12px")
      .attr("pointer-events", "none");

    function ticked() {
      // Constrain nodes to container bounds
      nodes.forEach(node => {
        node.x = Math.max(30, Math.min(width - 30, node.x));
        node.y = Math.max(30, Math.min(height - 30, node.y));
      });

      link
        .attr("x1", d => d.source.x)
        .attr("y1", d => d.source.y)
        .attr("x2", d => d.target.x)
        .attr("y2", d => d.target.y);

      node.attr("transform", d => `translate(${d.x},${d.y})`);
    }

    // Update positions on each tick
    simulationRef.current.on("tick", ticked);

    function dragstarted(
      event: d3.D3DragEvent<
        SVGGElement | SVGCircleElement,
        SimulationNode,
        SimulationNode
      >
    ) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(
      event: d3.D3DragEvent<
        SVGGElement | SVGCircleElement,
        SimulationNode,
        SimulationNode
      >
    ) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(
      event: d3.D3DragEvent<
        SVGGElement | SVGCircleElement,
        SimulationNode,
        SimulationNode
      >
    ) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      if (simulationRef.current) {
        simulationRef.current.stop()
        simulationRef.current = null
      }
    };
  }, [width, height]);

  return (
    <div className="relative h-screen w-full" ref={containerRef}>
      <svg ref={svgRef} className="h-full w-full" />
      {selectedSkill && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="bg-card absolute bottom-4 left-4 rounded-lg p-4 shadow-lg">
          <h3 className="mb-2 font-medium">{selectedSkill.name}</h3>
          <div className="text-muted-foreground space-y-1 text-sm">
            <p>{selectedSkill.yearsOfExperience} years of experience</p>
            <p>{selectedSkill.projects} projects completed</p>
            <p>Related: {selectedSkill.related.join(", ")}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
const colors = {
  Languages: "#3b82f6",
  Frameworks: "#8b5cf6",
  Technologies: "#ec4899",
  Platforms: "#10b981",
  Tools: "#f59e0b"
} as const;
function getColorForCategory<const T extends keyof typeof colors>(
  category: T
): string {
  return colors[category] ?? "#6b7280";
}

// export type PostInitializationSimulationNodeDatum = {
//   [P in keyof Omit<d3.SimulationNodeDatum, "fx" | "fy">]-?: Omit<
//     d3.SimulationNodeDatum,
//     "fx" | "fy"
//   >[P];
// } & { fx?: null | number; fy?: null | number };
