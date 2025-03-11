"use client"

import { useEffect, useRef, useState } from "react"
import * as d3 from "d3"
import { motion } from "framer-motion"

interface Skill {
  name: string
  category: string
  related: string[]
  projects: number
  yearsOfExperience: number
}

const skills: Skill[] = [
  {
    name: "TypeScript",
    category: "Languages",
    related: ["React", "Next.js", "Node.js"],
    projects: 45,
    yearsOfExperience: 5,
  },
  {
    name: "React",
    category: "Frameworks",
    related: ["TypeScript", "Next.js", "GraphQL"],
    projects: 40,
    yearsOfExperience: 5,
  },
  {
    name: "Next.js",
    category: "Frameworks",
    related: ["React", "TypeScript", "Vercel"],
    projects: 35,
    yearsOfExperience: 4,
  },
  {
    name: "Node.js",
    category: "Frameworks",
    related: ["TypeScript", "GraphQL", "Docker"],
    projects: 30,
    yearsOfExperience: 5,
  },
  {
    name: "GraphQL",
    category: "Technologies",
    related: ["React", "Node.js", "TypeScript"],
    projects: 25,
    yearsOfExperience: 4,
  },
  {
    name: "Docker",
    category: "Tools",
    related: ["Node.js", "AWS", "Vercel"],
    projects: 20,
    yearsOfExperience: 3,
  },
  {
    name: "AWS",
    category: "Platforms",
    related: ["Docker", "Node.js", "WordPress"],
    projects: 25,
    yearsOfExperience: 4,
  },
  {
    name: "Vercel",
    category: "Platforms",
    related: ["Next.js", "React", "TypeScript"],
    projects: 30,
    yearsOfExperience: 3,
  },
]

// Create a type for our D3 node with x and y coordinates
interface SimulationNode extends d3.SimulationNodeDatum {
  name: string
  category: string
  related: string[]
  projects: number
  yearsOfExperience: number
}

// Create a type for our D3 link with source and target
interface SimulationLink extends d3.SimulationLinkDatum<SimulationNode> {
  source: string | SimulationNode
  target: string | SimulationNode
}

export function SkillsVisualization() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [isClient, setIsClient] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient || !svgRef.current) return

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight
    const centerX = width / 2
    const centerY = height / 2

    // Clear previous content
    d3.select(svgRef.current).selectAll("*").remove()

    const svg = d3.select(svgRef.current).attr("width", width).attr("height", height)

    // Create nodes array with proper typing
    const nodes: SimulationNode[] = skills.map((skill) => ({
      ...skill,
      x: Math.random() * width,
      y: Math.random() * height,
    }))

    // Create a map for quick node lookup
    const nodeMap = new Map<string, SimulationNode>()
    nodes.forEach((node) => nodeMap.set(node.name, node))

    // Create links array with proper typing, ensuring all references exist
    const links: SimulationLink[] = []

    nodes.forEach((node) => {
      node.related.forEach((relatedName) => {
        const target = nodeMap.get(relatedName)
        if (target) {
          links.push({
            source: node,
            target: target,
          })
        }
      })
    })

    // Create force simulation
    const simulation = d3
      .forceSimulation<SimulationNode>(nodes)
      .force("charge", d3.forceManyBody().strength(-200))
      .force("center", d3.forceCenter(centerX, centerY))
      .force("collision", d3.forceCollide().radius(60))
      .force(
        "link",
        d3.forceLink<SimulationNode, SimulationLink>(links).id((d) => d.name),
      )

    // Add links
    const link = svg
      .append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#4b5563")
      .attr("stroke-opacity", 0.2)
      .attr("stroke-width", 1)

    // Create groups for each node
    const node = svg
      .append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("cursor", "pointer")
      .on("mouseover", (event, d) => {
        setSelectedSkill(d)
        d3.select(event.currentTarget).select("circle").transition().duration(200).attr("r", 35)
      })
      .on("mouseout", (event) => {
        setSelectedSkill(null)
        d3.select(event.currentTarget).select("circle").transition().duration(200).attr("r", 30)
      })
      .call((_selection)=>(d3.drag<SVGGElement, SimulationNode>().on("start", dragstarted).on("drag", dragged).on("end", dragended)))

    // Add circles to nodes
    node
      .append("circle")
      .attr("r", 30)
      .attr("fill", (d) => getColorForCategory(d.category))
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)

    // Add text labels
    node
      .append("text")
      .text((d) => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .attr("fill", "#fff")
      .attr("font-size", "12px")
      .attr("pointer-events", "none")

    // Update positions on each tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as SimulationNode).x || 0)
        .attr("y1", (d) => (d.source as SimulationNode).y || 0)
        .attr("x2", (d) => (d.target as SimulationNode).x || 0)
        .attr("y2", (d) => (d.target as SimulationNode).y || 0)

      node.attr("transform", (d) => `translate(${d.x || 0},${d.y || 0})`)
    })

    function dragstarted(event: d3.D3DragEvent<SVGGElement, SimulationNode, SimulationNode>) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, SimulationNode, SimulationNode>) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, SimulationNode, SimulationNode>) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }

    return () => {
      simulation.stop()
    }
  }, [isClient])

  return (
    <div className="relative w-full h-full">
      <svg ref={svgRef} className="w-full h-full" />
      {selectedSkill && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute bottom-4 left-4 bg-card p-4 rounded-lg shadow-lg"
        >
          <h3 className="font-medium mb-2">{selectedSkill.name}</h3>
          <div className="text-sm space-y-1 text-muted-foreground">
            <p>{selectedSkill.yearsOfExperience} years of experience</p>
            <p>{selectedSkill.projects} projects completed</p>
            <p>Related: {selectedSkill.related.join(", ")}</p>
          </div>
        </motion.div>
      )}
    </div>
  )
}

function getColorForCategory(category: string): string {
  const colors: Record<string, string> = {
    Languages: "#3b82f6",
    Frameworks: "#8b5cf6",
    Technologies: "#ec4899",
    Platforms: "#10b981",
    Tools: "#f59e0b",
  }
  return colors[category] || "#6b7280"
}

