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
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { GameState } from "../models/GameState";
import { calculateCosts } from "../engine/firm/calculateCosts";

interface CostCurvesProps {
  gameState: GameState;
}

export default function CostCurves({
  gameState,
}: CostCurvesProps) {
  const data = [];

  for (
    let quantity = 500;
    quantity <= 30000;
    quantity += 500
  ) {
    const costs = calculateCosts(
      quantity,
      gameState.firm.fixedCosts,
    );

    data.push({
      quantity,
      MC: costs.marginalCost,
      ATC: costs.averageTotalCost,
      AVC: costs.averageVariableCost,
      AFC: costs.averageFixedCost,
    });
  }

  const currentCosts = calculateCosts(
    gameState.firm.production,
    gameState.firm.fixedCosts,
  );

  // Small tolerance so values that are economically
  // almost equal are treated as approximately equal.
  const costTolerance = 0.05;

  const mcNearAtc =
    Math.abs(
      currentCosts.marginalCost -
        currentCosts.averageTotalCost,
    ) < costTolerance;

  const mcNearAvc =
    Math.abs(
      currentCosts.marginalCost -
        currentCosts.averageVariableCost,
    ) < costTolerance;

  return (
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          mb: 0.5,
        }}
      >
        Cost Curves
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Compare the cost of producing additional
        units with the firm's average costs. Move
        your production slider to see how costs
        change as output expands.
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: 400,
        }}
      >
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 35,
              right: 30,
              left: 20,
              bottom: 30,
            }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="quantity"
              type="number"
              domain={[0, 30000]}
              label={{
                value: "Quantity Produced",
                position: "insideBottom",
                offset: -15,
              }}
            />

            <YAxis
              label={{
                value: "Cost per Unit ($)",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip />

            <Legend
              verticalAlign="top"
              align="center"
              height={70}
              iconType="line"
              wrapperStyle={{
                paddingBottom: "20px",
                fontSize: "14px",
              }}
            />

            <Line
              type="monotone"
              dataKey="MC"
              name="Marginal Cost (MC)"
              stroke="#f97316"
              strokeWidth={4}
              dot={false}
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey="ATC"
              name="Average Total Cost (ATC)"
              stroke="#ef4444"
              strokeWidth={4}
              dot={false}
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey="AVC"
              name="Average Variable Cost (AVC)"
              stroke="#22c55e"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />

            <Line
              type="monotone"
              dataKey="AFC"
              name="Average Fixed Cost (AFC)"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={false}
              isAnimationActive={false}
            />

            <ReferenceLine
              x={gameState.firm.production}
              stroke="#facc15"
              strokeWidth={2}
              strokeDasharray="6 6"
              label={{
                value: "Your Output",
                position: "top",
                fill: "#facc15",
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            md: "repeat(4, 1fr)",
          },
          gap: 2,
          mt: 3,
        }}
      >
        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Marginal Cost
          </Typography>

          <Typography
            sx={{ fontWeight: 800 }}
          >
            $
            {currentCosts.marginalCost.toFixed(
              2,
            )}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Average Total Cost
          </Typography>

          <Typography
            sx={{ fontWeight: 800 }}
          >
            $
            {currentCosts.averageTotalCost.toFixed(
              2,
            )}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Average Variable Cost
          </Typography>

          <Typography
            sx={{ fontWeight: 800 }}
          >
            $
            {currentCosts.averageVariableCost.toFixed(
              2,
            )}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Average Fixed Cost
          </Typography>

          <Typography
            sx={{ fontWeight: 800 }}
          >
            $
            {currentCosts.averageFixedCost.toFixed(
              2,
            )}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 3,
          p: 2.5,
          borderRadius: 2,
          bgcolor:
            "rgba(255,255,255,0.04)",
          border:
            "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
            mb: 1.5,
          }}
        >
          What is happening at your output?
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 1 }}
        >
          {mcNearAtc
            ? "MC is approximately equal to ATC. Your firm is near the minimum point of the average total cost curve."
            : currentCosts.marginalCost <
                currentCosts.averageTotalCost
              ? "MC is below ATC. Producing additional units is pulling average total cost downward."
              : "MC is above ATC. Producing additional units is pushing average total cost upward."}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 1 }}
        >
          {mcNearAvc
            ? "MC is approximately equal to AVC. Your firm is near the minimum point of the average variable cost curve."
            : currentCosts.marginalCost <
                currentCosts.averageVariableCost
              ? "MC is below AVC, so average variable cost is falling."
              : "MC is above AVC, so average variable cost is rising."}
        </Typography>

        <Typography color="text.secondary">
          Average fixed cost falls as
          production increases because the same
          fixed costs are spread across more
          units.
        </Typography>

        <Typography
          sx={{
            mt: 2,
            fontWeight: 700,
          }}
        >
          Key idea: the marginal cost curve
          pulls the average cost curves. When
          MC is below an average, that average
          falls. When MC is above an average,
          that average rises.
        </Typography>
      </Box>
    </Paper>
  );
}