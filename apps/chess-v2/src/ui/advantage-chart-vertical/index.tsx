"use client";

import {
  Bar,
  ComposedChart,
  ReferenceLine,
  ResponsiveContainer,
  YAxis
} from "recharts";
import { ChartContainer } from "@/ui/atoms/chart";

const Y_DOMAIN = [-10, 10];

export function AdvantageChartVertical({ advantage }: { advantage: number }) {
  // Transform data for the chart

  const chartDataVertical = [{ name: "EngineEval", value: advantage }];
  return (
    <ChartContainer
      config={{
        advantage: {
          label: "VerticalAdvantage",
          color: "hsl(var(--chart-1))"
        }
      }}
      className={`h-[min(80dvh,100dvw)]! w-16 sm:h-[min(80dvh,95dvw)]!`}>
      <ResponsiveContainer width={"100%"} height={"100%"}>
        <ComposedChart
          data={chartDataVertical}
          layout="horizontal"
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <YAxis type="number" dataKey="value" domain={Y_DOMAIN}  hide />
          <ReferenceLine y={0} stroke="#000" strokeWidth={1} />
          <Bar
            dataKey="EngineEval"
            barSize={64}
            color={"#fff"}
            fill={"#fff"}
            background={{color: "#fff", fill: "#000" }} // White if > 0, black if < 0
            isAnimationActive={false} // Turn off animation if you want real-time quick updates
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
