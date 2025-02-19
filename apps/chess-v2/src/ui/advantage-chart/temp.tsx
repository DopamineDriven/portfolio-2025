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

export function AdvantageChartTwo({
  data,
  height: _height = 300
}: {
  data: {
    moveNumber: number;
    advantage: number;
  }[];
  height?: number;
}) {
  // Transform data for the chart
  const chartData = data.map(d => {
    let adv = d.advantage;
    if (adv > 10) adv = 10;
    if (adv < -10) adv = -10;
    return {
      moveNumber: d.moveNumber,
      advantage: adv
    };
  });

  return (
    <ChartContainer
      config={{
        advantage: {
          label: "advantage",
          color: "#f5f5f5"
        }
      }}
      className={`h-auto w-full overflow-hidden sm:max-h-[300px]`}>
      <div className="mx-auto">
        <ResponsiveContainer width={"99%"} aspect={1.8}>
          <AreaChart
            data={chartData}

            margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="adv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f5f5f5" stopOpacity={0.9} />
                <stop offset="50%" stopColor="#808080" stopOpacity={0.6} />
                <stop offset="100%" stopColor="#000000" stopOpacity={0.9} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="none" fill={"#000000"} />
            <XAxis
              dataKey="moveNumber"
              tick={false}
              strokeDasharray={"none"}
            />
            <YAxis
              domain={[-10, 10]}
              strokeDasharray={"none"}
              tick={false}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <ReferenceLine
              y={0}
              stroke="#f5f5f5"
              strokeDasharray={"none"}
              strokeOpacity={0.3}
              strokeWidth={1}
            />
            <Area
              type="monotone"
              dataKey="advantage"
              stroke="#f5f5f5"
              color="#f5f5f5"
              fill="#f5f5f5"
              baseValue={-10}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartContainer>
  );
}
