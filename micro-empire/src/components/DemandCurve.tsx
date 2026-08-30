import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { GameState } from "../models/GameState";
import { priceForQuantity } from "../engine/firm/calculateMarginalRevenue";
interface DemandCurveProps {
  gameState: GameState;
}

export default function DemandCurve({
  gameState,
}: DemandCurveProps) {
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

  const isMonopolisticCompetition =
    gameState.market.structure ===
    "Monopolistic Competition";

  const data: {
    price: number;
    quantity: number;
  }[] = [];

  /*
   * PERFECT COMPETITION
   *
   * The individual firm is a price taker.
   * Its demand curve is perfectly elastic
   * at the market price:
   *
   * P = D = AR = MR
   */
  if (isPerfectCompetition) {
    for (
      let quantity = 0;
      quantity <= 30000;
      quantity += 500
    ) {
      data.push({
        quantity,
        price: averageMarketPrice,
      });
    }
 } else {
  for (
    let quantity = 0;
    quantity <= 30000;
    quantity += 500
  ) {
    data.push({
      quantity,
      price: priceForQuantity(
        gameState,
        quantity,
      ),
    });
  }
}

  /*
   * Under perfect competition, output is the
   * firm's chosen quantity.
   *
   * Otherwise quantity demanded comes from
   * the demand curve.
   */
 const currentQuantity =
  gameState.firm.production;

const displayedPrice =
  isPerfectCompetition
    ? averageMarketPrice
    : priceForQuantity(
        gameState,
        currentQuantity,
      );

  let elasticityExplanation: string;

  if (isPerfectCompetition) {
    elasticityExplanation =
      "The individual firm's demand curve is perfectly elastic at the market price. If the firm charges more than the market price, buyers can purchase the same product from competing firms.";
  } else if (priceElasticity > 1.05) {
    elasticityExplanation =
      "Demand is elastic. Consumers are relatively responsive to price changes, so a percentage change in price produces a larger percentage change in quantity demanded.";
  } else if (priceElasticity < 0.95) {
    elasticityExplanation =
      "Demand is inelastic. Consumers are relatively less responsive to price changes, so quantity demanded changes proportionally less than price.";
  } else {
    elasticityExplanation =
      "Demand is approximately unit elastic. The percentage change in quantity demanded is about equal to the percentage change in price.";
  }

  let marketExplanation: string;

  if (isPerfectCompetition) {
    marketExplanation =
      "Your firm is a price taker. The market determines the price, and your firm chooses how much output to produce at that price.";
  } else if (isMonopoly) {
    marketExplanation =
      "Your firm is the market. Producing more requires moving down the demand curve and accepting a lower price, while restricting output allows a higher price.";
  } else if (isMonopolisticCompetition) {
    marketExplanation =
      "Your firm has some pricing power because its product is differentiated, but consumers can switch to competing substitutes when your price rises.";
  } else {
    marketExplanation =
      "In an oligopoly, your firm's decisions depend not only on consumer demand but also on how rival firms respond.";
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
        {isPerfectCompetition
          ? "Firm Demand"
          : isMonopoly
            ? "Market Demand"
            : "Firm Demand"}
      </Typography>

      <Typography
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        {isPerfectCompetition
          ? "A perfectly competitive firm is a price taker. It faces a horizontal demand curve at the market price, where P = D = AR = MR."
          : isMonopoly
            ? "A monopolist faces the market demand curve. Higher output requires accepting a lower price."
            : "Higher prices reduce quantity demanded. Consumer responsiveness depends on the market's price elasticity of demand."}
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
              top: 30,
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
              domain={
                isPerfectCompetition
                  ? [0, 30000]
                  : [0, "dataMax"]
              }
              label={{
                value: isPerfectCompetition
                  ? "Firm Output"
                  : "Quantity Demanded",
                position: "insideBottom",
                offset: -15,
              }}
            />

            <YAxis
              dataKey="price"
              type="number"
              domain={[0, 15]}
              label={{
                value: "Price ($)",
                angle: -90,
                position: "insideLeft",
              }}
            />

            <Tooltip
              formatter={(value) => [
                `$${Number(value).toFixed(2)}`,
                isPerfectCompetition
                  ? "P = D = AR = MR"
                  : "Price",
              ]}
              labelFormatter={(quantity) =>
                `Quantity: ${Number(
                  quantity,
                ).toLocaleString()}`
              }
            />

            <Line
              type="linear"
              dataKey="price"
              name={
                isPerfectCompetition
                  ? "P = D = AR = MR"
                  : "Demand"
              }
              stroke={
                isPerfectCompetition
                  ? "#22c55e"
                  : "#38bdf8"
              }
              strokeWidth={4}
              dot={false}
              isAnimationActive={false}
            />

            <ReferenceDot
              x={currentQuantity}
              y={displayedPrice}
              r={8}
              fill="#facc15"
              stroke="#ffffff"
              strokeWidth={2}
              label={{
                value: "Your Firm",
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
            xs: "1fr",
            sm: "repeat(3, 1fr)",
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
            {isPerfectCompetition
              ? "Market Price"
              : "Current Price"}
          </Typography>

          <Typography
            sx={{ fontWeight: 800 }}
          >
            ${displayedPrice.toFixed(2)}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {isPerfectCompetition
              ? "Firm Output"
              : "Quantity Demanded"}
          </Typography>

          <Typography
            sx={{ fontWeight: 800 }}
          >
            {Math.round(
              currentQuantity,
            ).toLocaleString()}
          </Typography>
        </Box>

        <Box>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {isPerfectCompetition
              ? "Firm Demand"
              : "Price Elasticity"}
          </Typography>

          <Typography
            sx={{ fontWeight: 800 }}
          >
            {isPerfectCompetition
              ? "Perfectly Elastic"
              : priceElasticity.toFixed(2)}
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
          {marketExplanation}
        </Typography>

        <Typography
          sx={{
            mt: 2,
            fontWeight: 700,
          }}
        >
          {isPerfectCompetition
            ? "Market Price = Firm Demand = AR = MR"
            : isMonopoly
              ? "Output ↑ → Price ↓  |  Output ↓ → Price ↑"
              : "Price ↑ → Quantity Demanded ↓  |  Price ↓ → Quantity Demanded ↑"}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          {elasticityExplanation}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 2 }}
        >
          {isPerfectCompetition
            ? "Key idea: this is the demand curve facing one competitive firm, not the entire market demand curve. Market demand still slopes downward, but an individual firm is too small to influence the market price."
            : "Key idea: a movement along the demand curve occurs when the product's own price changes. A change in another determinant of demand shifts the entire curve."}
        </Typography>
      </Box>
    </Paper>
  );
}