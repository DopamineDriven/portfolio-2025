"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  XAxis,
  YAxis
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/ui/atoms/chart";

export function AdvantageChartTwo({ data, height: _height = 300 }: {data: {
  moveNumber: number;
  advantage: number;
}[]; height?: number}) {
  // Transform data for the chart
  const chartData = data.map((d) => {
    let adv = d.advantage
    if (adv > 10) adv = 10
    if (adv < -10) adv = -10
    return {
      moveNumber: d.moveNumber,
      advantage: adv,
    }
  })

  return (
    <ChartContainer
      config={{
        advantage: {
          label: "advantage",
          color: "#ffffffe6"
        }
      }}
      className={`h-auto sm:min-h-fit w-full`}>
      <ResponsiveContainer width={"100%"} height={"100%"} className={"bg-gray-950"}>
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
    <defs>
      <linearGradient id="adv" x1="0" y1="0" x2="0" y2="1">
        <stop offset="5%" stopColor="#ffffffe6" stopOpacity={0.7} />
        <stop offset="95%" stopColor="#ffffffe6" stopOpacity={1} />
      </linearGradient>
    </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="moveNumber" />
          <YAxis domain={[-10, 10]} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <ReferenceLine y={0} stroke="#ffffffe6" strokeDasharray="3 3" />
          <Area
      type="monotone"
      dataKey="advantage"
      stroke="#ffffffe6"
color="#ffffffe6"
fill="#ffffffe6"
baseValue={-10}
      // you can also use baseValue="0" if you want the area
      // to fill from y=0 up or down, rather than from the axis min.
    />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
