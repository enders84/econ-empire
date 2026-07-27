import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

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

import type { EconomicHistory } from "../models/EconomicHistory";

interface EconomicChartProps {
  history: EconomicHistory[];
}

export default function EconomicChart({
  history,
}: EconomicChartProps) {
  if (history.length === 0) {
    return (
      <Paper elevation={4} sx={{ p: 3 }}>
        <Typography
          variant="h5"
          fontWeight="bold"
        >
          Economic History
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 1 }}
        >
          Economic data will appear after the first
          quarter.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={4} sx={{ p: 3 }}>
      <Typography
        variant="h5"
        fontWeight="bold"
        gutterBottom
      >
        Economic History
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 2 }}
      >
        Track GDP, debt, inflation, unemployment,
        and approval across each quarter.
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: {
            xs: 350,
            sm: 430,
          },
        }}
      >
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <LineChart
            data={history}
            margin={{
              top: 20,
              right: 40,
              left: 20,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis
              dataKey="quarter"
              tickFormatter={(value) =>
                `Q${Number(value)}`
              }
            />

            <YAxis
              yAxisId="money"
              orientation="left"
              domain={["auto", "auto"]}
              tickFormatter={(value) =>
                `$${Number(value).toLocaleString(
                  "en-US"
                )}B`
              }
            />

            <YAxis
              yAxisId="percent"
              orientation="right"
              domain={["auto", 100]}
              tickFormatter={(value) =>
                `${Number(value)}%`
              }
            />

            <Tooltip
              labelFormatter={(quarter) =>
                `Quarter ${quarter}`
              }
              formatter={(value, name) => {
                const numberValue = Number(value);
                const seriesName = String(name);

                if (
                  seriesName === "GDP" ||
                  seriesName === "Debt"
                ) {
                  return [
                    `$${numberValue.toLocaleString(
                      "en-US",
                      {
                        maximumFractionDigits: 1,
                      }
                    )}B`,
                    seriesName,
                  ];
                }

                return [
                  `${numberValue.toFixed(1)}%`,
                  seriesName,
                ];
              }}
            />

            <Legend />

            <Line
              yAxisId="money"
              type="monotone"
              dataKey="gdp"
              name="GDP"
              stroke="#1976d2"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              isAnimationActive={false}
            />

            <Line
              yAxisId="money"
              type="monotone"
              dataKey="debt"
              name="Debt"
              stroke="#d32f2f"
              strokeWidth={3}
              dot={{ r: 5 }}
              activeDot={{ r: 7 }}
              isAnimationActive={false}
            />

            <Line
              yAxisId="percent"
              type="monotone"
              dataKey="inflation"
              name="Inflation"
              stroke="#ed6c02"
              strokeWidth={2}
              dot={{ r: 4 }}
              isAnimationActive={false}
            />

            <Line
              yAxisId="percent"
              type="monotone"
              dataKey="unemployment"
              name="Unemployment"
              stroke="#9c27b0"
              strokeWidth={2}
              dot={{ r: 4 }}
              isAnimationActive={false}
            />

            <Line
              yAxisId="percent"
              type="monotone"
              dataKey="approval"
              name="Approval"
              stroke="#2e7d32"
              strokeWidth={2}
              dot={{ r: 4 }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
}