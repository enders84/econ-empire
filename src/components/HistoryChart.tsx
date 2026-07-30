import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Paper, Typography } from "@mui/material";
import type { HistoryPoint } from "../models/GameState";

interface HistoryChartProps {
  title: string;
  data: HistoryPoint[];
  lines: {
    dataKey: keyof HistoryPoint;
    label: string;
  }[];
}

export default function HistoryChart({
  title,
  data,
  lines,
}: HistoryChartProps) {
  const chartData = data.map((point) => ({
    ...point,
    period: `Y${point.year} Q${point.quarter}`,
  }));

  return (
    <Paper sx={{ p: 3, height: 360 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, mb: 2 }}
      >
        {title}
      </Typography>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="period" />

          <YAxis />

          <Tooltip />

          <Legend />

          {lines.map((line, index) => (
            <Line
              key={String(line.dataKey)}
              type="monotone"
              dataKey={String(line.dataKey)}
              name={line.label}
              stroke={
                index === 0
                  ? "#6ea8fe"
                  : "#ffb74d"
              }
              strokeWidth={2}
              dot
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}