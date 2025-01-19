"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts";
import type { AdvantageChartProps } from "@/types/advantage";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/ui/atoms/chart";

export function AdvantageChart({ data, height = 300 }: AdvantageChartProps) {
  // Transform data for the chart
  const chartData = data.map(item => ({
    moveNumber: `Move ${item.moveNumber}`,
    advantage: item.advantage
  }));

  return (
    <ChartContainer
      config={{
        advantage: {
          label: "Advantage",
          color: "hsl(var(--chart-1))"
        }
      }}
      className={`h-[${height}px] min-h-[200px] w-full`}>
      <ResponsiveContainer width={"100%"} height={"100%"}>
        <LineChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
          <XAxis
            dataKey="moveNumber"
            stroke="hsl(var(--foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="hsl(var(--foreground))"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            domain={["auto", "auto"]}
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Line
            type="monotone"
            dataKey="advantage"
            stroke="var(--color-advantage)"
            dot={false}
            strokeWidth={2}
          />
          {/* Zero line reference */}
          <CartesianGrid
            y={0}
            stroke="hsl(var(--muted))"
            strokeWidth={2}
            horizontal={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
