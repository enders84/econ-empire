import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { HistoryPoint } from "../../models/History";

interface HistoryChartProps {
  history: HistoryPoint[];
}

export default function HistoryChart({
  history,
}: HistoryChartProps) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart
        data={history}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          dataKey="quarter"
          label={{
            value: "Quarter",
            position: "insideBottom",
            offset: -5,
          }}
        />

        <YAxis />

        <Tooltip />

        <Line
          type="monotone"
          dataKey="gdp"
          name="GDP"
          stroke="#1976d2"
          strokeWidth={3}
          dot={false}
        />

        <Line
          type="monotone"
          dataKey="potentialGdp"
          name="Potential GDP"
          stroke="#757575"
          strokeWidth={2}
          strokeDasharray="6 4"
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}