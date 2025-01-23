"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { useChartCapture } from "@/hooks/use-chart-capture";
import { Button } from "@/ui/atoms/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/atoms/card";

// TODO -- abstract props, consume in review mode

// Sample chess advantage data
const data = [
  { moveNumber: 1, advantage: 0.3 },
  { moveNumber: 2, advantage: 0.1 },
  { moveNumber: 3, advantage: -0.2 },
  { moveNumber: 4, advantage: -1.1 },
  { moveNumber: 5, advantage: -2.3 },
  { moveNumber: 6, advantage: -3.2 },
  { moveNumber: 7, advantage: -4.7 }
];

export default function ChartCapture() {
  const chartRef = useRef<HTMLDivElement>(null);
  const { capturedImage, captureChart, downloadChart, dimensions } =
    useChartCapture({
      chartRef
    });

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Chess Game Advantage Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <div ref={chartRef} className="max-h-[300px] w-full bg-black p-4">
            <ResponsiveContainer width="99%" aspect={3}>
              <AreaChart
                data={data}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <XAxis dataKey="moveNumber" stroke="#666" />
                <YAxis stroke="#666" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.8)",
                    border: "none",
                    borderRadius: "4px"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="advantage"
                  stroke="#666"
                  fill="#666"
                  fillOpacity={0.8}
                  isAnimationActive={true}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex gap-4">
            <Button onClick={captureChart}>Capture Chart</Button>
            <Button onClick={downloadChart} disabled={!capturedImage}>
              Download Chart
            </Button>
          </div>
        </CardContent>
      </Card>

      {capturedImage && (
        <Card>
          <CardHeader>
            <CardTitle>Captured Chart Image</CardTitle>
          </CardHeader>
          <CardContent>
            {dimensions.width > 0 && dimensions.height > 0 ? (
              <Image
                src={capturedImage ?? "/placeholder.svg"}
                alt="Captured chess advantage chart"
                width={dimensions.width}
                height={dimensions.height}
                className="h-auto w-full"
              />
            ) : (
              <div className="flex h-[300px] w-full items-center justify-center bg-gray-200">
                <p>Loading chart image...</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
