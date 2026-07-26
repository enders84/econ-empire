import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
} from "@mui/material";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import type { EconomicHistory } from "../models/EconomicHistory";

interface EconomicChartProps {
  history: EconomicHistory[];
}

function EconomicChart({ history }: EconomicChartProps) {
  const [selectedMetric, setSelectedMetric] = useState("gdp");

  return (
    <Paper elevation={4} sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        📈 Economic Trends
      </Typography>

      <Tabs
        value={selectedMetric}
        onChange={(_, value) => setSelectedMetric(value)}
        centered
        sx={{ mb: 2 }}
      >
        <Tab label="GDP" value="gdp" />
        <Tab label="Inflation" value="inflation" />
        <Tab label="Jobs" value="unemployment" />
        <Tab label="Debt" value="debt" />
        <Tab label="Approval" value="approval" />
      </Tabs>

      <Box sx={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="quarter"
              label={{
                value: "Quarter",
                position: "insideBottom",
                offset: -5,
              }}
            />

            <YAxis domain={["auto", "auto"]} />

            <Tooltip
              labelFormatter={(label) => `Quarter ${label}`}
            />

            <Line
              type="monotone"
              dataKey={selectedMetric}
              stroke="#1976d2"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}

export default EconomicChart;