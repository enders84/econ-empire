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

const lineColors = [
  "#6ea8fe",
  "#ffb74d",
  "#66bb6a",
  "#ef5350",
  "#ab47bc",
  "#26c6da",
];

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
    <Paper
      sx={{
        p: 3,
        height: 380,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 700,
          mb: 2,
        }}
      >
        {title}
      </Typography>

      <ResponsiveContainer
        width="100%"
        height="90%"
      >
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="period"
            minTickGap={20}
          />

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
                lineColors[
                  index % lineColors.length
                ]
              }
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 5 }}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </Paper>
  );
}