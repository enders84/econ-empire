import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { GameState } from "../models/GameState";
import { priceForQuantity } from "../engine/firm/calculateMarginalRevenue";
interface RevenueAnalysisProps {
  gameState: GameState;
}

const money = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default function RevenueAnalysis({
  gameState,
}: RevenueAnalysisProps) {
  const {
    averageMarketPrice,
    priceElasticity,
  } = gameState.market;

  const isPerfectCompetition =
    gameState.market.structure ===
    "Perfect Competition";

  const isMonopoly =
    gameState.market.structure ===
    "Monopoly";


  const data: {
    quantity: number;
    price: number;
    revenue: number;
  }[] = [];

  let maximumRevenue = 0;
  let maximumRevenueQuantity = 0;

  /*
   * PERFECT COMPETITION:
   *
   * Price is fixed at the market price.
   * Therefore:
   *
   * TR = P × Q
   *
   * Total revenue rises linearly with output.
   *
   * MARKET POWER:
   *
   * Price falls as quantity rises.
   */
  for (
    let quantity = 0;
    quantity <= 30000;
    quantity += 500
  ) {
   const price =
  isPerfectCompetition
    ? averageMarketPrice
    : priceForQuantity(
        gameState,
        quantity,
      );
    const revenue =
      price * quantity;

    if (revenue > maximumRevenue) {
      maximumRevenue = revenue;
      maximumRevenueQuantity =
        quantity;
    }

    data.push({
      quantity,
      price:
        Math.round(price * 100) / 100,
      revenue:
        Math.round(revenue),
    });
  }

  const currentQuantity =
    gameState.firm.production;

 const currentPrice =
  isPerfectCompetition
    ? averageMarketPrice
    : priceForQuantity(
        gameState,
        currentQuantity,
      );

  const potentialRevenue =
    currentPrice * currentQuantity;

  /*
   * Estimate marginal revenue around the
   * player's current quantity.
   */
  const quantityStep = 500;

  const previousQuantity =
    Math.max(
      0,
      currentQuantity - quantityStep,
    );

  const nextQuantity =
    Math.min(
      30000,
      currentQuantity + quantityStep,
    );

  const previousPrice =
    isPerfectCompetition
      ? averageMarketPrice
      : priceForQuantity(
          gameState,
          previousQuantity,
        );

  const nextPrice =
    isPerfectCompetition
      ? averageMarketPrice
      : priceForQuantity(
          gameState,
          nextQuantity,
        );

  const previousRevenue =
    previousPrice * previousQuantity;

  const nextRevenue =
    nextPrice * nextQuantity;

  const marginalRevenueEstimate =
    nextQuantity !== previousQuantity
      ? (nextRevenue -
          previousRevenue) /
        (nextQuantity -
          previousQuantity)
      : 0;

  const revenueTolerance = 0.05;

  const mrNearZero =
    Math.abs(
      marginalRevenueEstimate,
    ) <= revenueTolerance;

  let revenueExplanation: string;

  if (isPerfectCompetition) {
    revenueExplanation =
      "Because your firm is a price taker, each additional unit sold adds the same market price to total revenue. Total revenue therefore rises at a constant rate as output increases.";
  } else if (mrNearZero) {
    revenueExplanation =
      "Total revenue is near its maximum. Marginal revenue is approximately zero, meaning additional output adds very little to total revenue.";
  } else if (
    marginalRevenueEstimate > 0
  ) {
    revenueExplanation =
      "Total revenue is still rising as output increases. Marginal revenue is positive because additional sales add more revenue than is lost from the lower price.";
  } else {
    revenueExplanation =
      "Total revenue is falling as output increases. Marginal revenue is negative because the lower price reduces revenue on existing sales by more than the additional units add.";
  }

  let elasticityMessage: string;

  if (isPerfectCompetition) {
    elasticityMessage =
      "For an individual perfectly competitive firm, demand is perfectly elastic at the market price.";
  } else if (priceElasticity > 1.05) {
    elasticityMessage =
      "Demand is elastic. Quantity demanded is relatively responsive to changes in price.";
  } else if (
    priceElasticity < 0.95
  ) {
    elasticityMessage =
      "Demand is inelastic. Quantity demanded is relatively less responsive to changes in price.";
  } else {
    elasticityMessage =
      "Demand is approximately unit elastic.";
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
        Total Revenue
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        {isPerfectCompetition
          ? "A competitive firm sells at a constant market price, so total revenue increases proportionally with output."
          : isMonopoly
            ? "A monopolist must consider both price and quantity. Increasing output requires accepting a lower price, creating a tradeoff that shapes total revenue."
            : "Total revenue equals price multiplied by quantity sold. Both price and quantity affect the firm's revenue."}
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
              top: 35,
              right: 40,
              left: 40,
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
                value: "Quantity Sold",
                position: "insideBottom",
                offset: -15,
              }}
            />

            <YAxis
              tickFormatter={(value) =>
                `$${(
                  Number(value) / 1000
                ).toFixed(0)}k`
              }
              label={{
                value: "Total Revenue",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip
              formatter={(value) => [
                money(Number(value)),
                "Total Revenue",
              ]}
              labelFormatter={(
                quantity,
              ) =>
                `Quantity: ${Number(
                  quantity,
                ).toLocaleString()}`
              }
            />

            <Line
              type={
                isPerfectCompetition
                  ? "linear"
                  : "monotone"
              }
              dataKey="revenue"
              name="Total Revenue"
              stroke="#22c55e"
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

            {!isPerfectCompetition && (
              <ReferenceLine
                x={
                  maximumRevenueQuantity
                }
                stroke="#a78bfa"
                strokeWidth={2}
                strokeDasharray="4 4"
                label={{
                  value: "Maximum TR",
                  position:
                    "insideTopRight",
                  fill: "#a78bfa",
                }}
              />
            )}
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

          <Typography
            variant="h6"
            sx={{ fontWeight: 800 }}
          >
            {currentQuantity.toLocaleString()}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Price
          </Typography>

          <Typography
            variant="h6"
            sx={{ fontWeight: 800 }}
          >
            ${currentPrice.toFixed(2)}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Potential Revenue
          </Typography>

          <Typography
            variant="h6"
            sx={{ fontWeight: 800 }}
          >
            {money(potentialRevenue)}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            Estimated MR
          </Typography>

          <Typography
            variant="h6"
            sx={{ fontWeight: 800 }}
          >
            $
            {marginalRevenueEstimate.toFixed(
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
            mb: 1,
          }}
        >
          What is happening?
        </Typography>

        <Typography color="text.secondary">
          {revenueExplanation}
        </Typography>

        <Typography
          sx={{
            mt: 2,
            fontWeight: 700,
          }}
        >
          {isPerfectCompetition
            ? "Constant Price → Constant MR → TR rises with output"
            : mrNearZero
              ? "MR ≈ 0 → Total Revenue is near its maximum"
              : marginalRevenueEstimate >
                  0
                ? "MR > 0 → Total Revenue is rising"
                : "MR < 0 → Total Revenue is falling"}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          {elasticityMessage}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          Key idea: marginal revenue tells
          you how much total revenue changes
          when one more unit is sold. When
          MR is positive, TR rises. When MR
          reaches zero, TR is maximized. When
          MR becomes negative, TR falls.
        </Typography>
      </Box>
    </Paper>
  );
}