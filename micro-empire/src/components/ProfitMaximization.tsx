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
import { calculateMarginalRevenue } from "../engine/firm/calculateMarginalRevenue";
import {
  marginalRevenueForMonopolisticQuantity,
} from "../engine/market/monopolisticCompetition";
interface ProfitMaximizationProps {
  gameState: GameState;
}

export default function ProfitMaximization({
  gameState,
}: ProfitMaximizationProps) {
  const data = [];

  let optimalQuantity = 500;
  let smallestDifference = Infinity;

  for (
    let quantity = 500;
    quantity <= 30000;
    quantity += 500
  ) {
    const costs = calculateCosts(
      quantity,
      gameState.firm.fixedCosts,
    );

    const marginalRevenue =
  gameState.market.structure ===
  "Perfect Competition"
    ? gameState.market.averageMarketPrice
    : gameState.market.structure ===
        "Monopolistic Competition"
      ? marginalRevenueForMonopolisticQuantity(
          gameState,
          quantity,
          gameState.firm.brandStrength,
        )
      : calculateMarginalRevenue(
          gameState,
          quantity,
        );

    const difference = Math.abs(
      marginalRevenue - costs.marginalCost,
    );

    if (difference < smallestDifference) {
      smallestDifference = difference;
      optimalQuantity = quantity;
    }

    data.push({
      quantity,
      MR: marginalRevenue,
      MC: costs.marginalCost,
    });
  }

  const currentQuantity =
    gameState.firm.production;

  const currentMC = calculateCosts(
    currentQuantity,
    gameState.firm.fixedCosts,
  ).marginalCost;

  const currentMR =
  gameState.market.structure ===
  "Perfect Competition"
    ? gameState.market.averageMarketPrice
    : gameState.market.structure ===
        "Monopolistic Competition"
      ? marginalRevenueForMonopolisticQuantity(
          gameState,
          currentQuantity,
          gameState.firm.brandStrength,
        )
      : calculateMarginalRevenue(
          gameState,
          currentQuantity,
        );

  const difference =
    currentMR - currentMC;

  const tolerance = 0.15;

  const nearOptimal =
    Math.abs(difference) <= tolerance;

  let recommendation: string;

  if (nearOptimal) {
    recommendation =
      "You are near the profit-maximizing output. Marginal revenue is approximately equal to marginal cost.";
  } else if (difference > 0) {
    recommendation =
      "You may be producing too little. Marginal revenue is greater than marginal cost, so producing additional units can add more to revenue than to cost.";
  } else {
    recommendation =
      "You may be producing too much. Marginal cost is greater than marginal revenue, so the additional units cost more to produce than they add to revenue.";
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          mb: 0.5,
        }}
      >
        Profit Maximization
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        {gameState.market.structure ===
"Perfect Competition"
  ? "In perfect competition, the firm is a price taker. Price equals marginal revenue, and profit is maximized where P = MR = MC."
  : gameState.market.structure ===
      "Monopoly"
    ? "A monopolist faces the market demand curve. Marginal revenue is below price, and profit is maximized near the quantity where MR = MC."
    : gameState.market.structure ===
        "Monopolistic Competition"
      ? "A monopolistically competitive firm faces a downward-sloping demand curve because its product is differentiated. Marginal revenue lies below price, and profit is maximized near the quantity where MR = MC."
      : "Compare marginal revenue with marginal cost to determine whether your firm should increase or decrease production."}
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: 420,
        }}
      >
        <ResponsiveContainer>
          <LineChart
            data={data}
            margin={{
              top: 45,
              right: 40,
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
                value: "$ per Unit",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip />

            <Legend
              verticalAlign="top"
              align="center"
              height={45}
              iconType="line"
              wrapperStyle={{
                fontSize: "14px",
              }}
            />

            <Line
              type="monotone"
              dataKey="MR"
              name="Marginal Revenue (MR)"
              stroke="#22c55e"
              strokeWidth={4}
              dot={false}
              isAnimationActive={false}
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

            <ReferenceLine
              x={currentQuantity}
              stroke="#facc15"
              strokeWidth={2}
              strokeDasharray="6 6"
              label={{
                value: "Your Output",
                position: "top",
                fill: "#facc15",
              }}
            />

            <ReferenceLine
              x={optimalQuantity}
              stroke="#a78bfa"
              strokeWidth={2}
              strokeDasharray="4 4"
              label={{
                value: "MR = MC",
                position: "insideTopRight",
                fill: "#a78bfa",
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
            Your Output
          </Typography>

          <Typography sx={{ fontWeight: 800 }}>
            {currentQuantity.toLocaleString()}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Marginal Revenue
          </Typography>

          <Typography sx={{ fontWeight: 800 }}>
            ${currentMR.toFixed(2)}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Marginal Cost
          </Typography>

          <Typography sx={{ fontWeight: 800 }}>
            ${currentMC.toFixed(2)}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Estimated Optimal Output
          </Typography>

          <Typography sx={{ fontWeight: 800 }}>
            {optimalQuantity.toLocaleString()}
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
            mb: 1,
          }}
        >
          What should your firm do?
        </Typography>

        <Typography color="text.secondary">
          {recommendation}
        </Typography>

        {!nearOptimal &&
          difference > 0 && (
            <Typography
              sx={{
                mt: 2,
                fontWeight: 700,
              }}
            >
              MR &gt; MC → Increase production
            </Typography>
          )}

        {!nearOptimal &&
          difference < 0 && (
            <Typography
              sx={{
                mt: 2,
                fontWeight: 700,
              }}
            >
              MC &gt; MR → Decrease production
            </Typography>
          )}

        {nearOptimal && (
          <Typography
            sx={{
              mt: 2,
              fontWeight: 700,
            }}
          >
            MR ≈ MC → Stay near this output
          </Typography>
        )}

        <Typography
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          Key idea: producing another unit is
          worthwhile while the additional revenue
          from that unit exceeds its additional
          cost. The firm should stop expanding
          output when MR and MC are approximately
          equal.
        </Typography>
      </Box>
    </Paper>
  );
}