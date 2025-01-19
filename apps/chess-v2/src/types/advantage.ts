export type MoveAdvantage = {
  moveNumber: number;
  advantage: number;
  fen: string;
};

export interface AdvantageChartProps {
  data: MoveAdvantage[];
  height?: number;
}
