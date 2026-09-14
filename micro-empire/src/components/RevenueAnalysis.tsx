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
import {
  getMonopolisticBrandMultiplier,
  priceForMonopolisticQuantity,
  quantityForMonopolisticPrice,
  marginalRevenueForMonopolisticQuantity,
} from "../engine/market/monopolisticCompetition";
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
    baseDemand,
    averageMarketPrice,
    priceElasticity,
    marketSize,
  } = gameState.market;

  const {
    price: firmPrice,
    production,
    brandStrength,
    advertising,
  } = gameState.firm;

  const structure =
    gameState.market.structure;

  const isPerfectCompetition =
    structure === "Perfect Competition";

  const isMonopoly =
    structure === "Monopoly";

  const isMonopolisticCompetition =
    structure ===
    "Monopolistic Competition";

/*
 * ========================================
 * MONOPOLISTIC COMPETITION
 * ========================================
 *
 * Revenue Analysis uses the exact same
 * demand model as the market engine and
 * Demand Curve component.
 */

const brandDemandMultiplier =
  getMonopolisticBrandMultiplier(
    brandStrength,
  );
  /*
   * ========================================
   * GENERIC DEMAND
   * ========================================
   *
   * Temporary Oligopoly calculation until
   * we build strategic rival reactions.
   */

  const quantityForGenericPrice = (
    price: number,
  ): number => {
    const safePrice =
      Math.max(price, 0.01);

    return Math.min(
      marketSize,
      Math.max(
        0,
        baseDemand *
          Math.pow(
            safePrice /
              averageMarketPrice,
            -priceElasticity,
          ),
      ),
    );
  };

  /*
   * ========================================
   * PRICE FOR A GIVEN QUANTITY
   * ========================================
   *
   * Revenue is graphed against quantity.
   *
   * For Monopoly we already have an inverse
   * demand function.
   *
   * For Monopolistic Competition we invert
   * the firm's brand-adjusted demand curve.
   */

  const genericPriceForQuantity = (
    quantity: number,
  ): number => {
    const safeQuantity =
      Math.max(quantity, 1);

    return (
      averageMarketPrice *
      Math.pow(
        safeQuantity /
          baseDemand,
        -1 /
          priceElasticity,
      )
    );
  };

  /*
   * ========================================
   * BUILD TOTAL REVENUE CURVE
   * ========================================
   */

  const data: {
    quantity: number;
    price: number;
    revenue: number;
  }[] = [];

  let maximumRevenue = 0;
  let maximumRevenueQuantity = 0;

  for (
    let quantity = 500;
    quantity <= 30000;
    quantity += 500
  ) {
    let price: number;

    if (isPerfectCompetition) {
      /*
       * Competitive firm:
       *
       * P = MR = market price.
       */
      price =
        averageMarketPrice;
    } else if (isMonopoly) {
      /*
       * Monopoly:
       *
       * Market demand determines price.
       */
      price =
        priceForQuantity(
          gameState,
          quantity,
        );
    } else if (
      isMonopolisticCompetition
    ) {
      /*
       * Monopolistic Competition:
       *
       * Brand-adjusted firm demand
       * determines price.
       */
      price =
  priceForMonopolisticQuantity(
    gameState,
    quantity,
    brandStrength,
  );
    } else {
      /*
       * Oligopoly:
       *
       * Temporary generic demand model.
       */
      price =
        genericPriceForQuantity(
          quantity,
        );
    }

    /*
     * Keep the graph within the same
     * practical $1-$15 price range used
     * by the player's price slider.
     */
    const economicPrice =
  Math.max(0, price);

const revenue =
  economicPrice * quantity;

    if (
      revenue >
      maximumRevenue
    ) {
      maximumRevenue =
        revenue;

      maximumRevenueQuantity =
        quantity;
    }

    data.push({
      quantity,

      price:
        Math.round(
          economicPrice * 100,
        ) / 100,

      revenue:
        Math.round(revenue),
    });
  }
  /*
 * ========================================
 * TRUE REVENUE MAXIMUM CHECK
 * ========================================
 *
 * A maximum should only be labeled when
 * total revenue reaches an interior peak.
 *
 * If the largest observed revenue occurs
 * at the final graph point, TR is still
 * rising within the displayed range.
 * In that case we should NOT tell the
 * student that TR has been maximized.
 */

const lastDataPoint =
  data[data.length - 1];

const firstDataPoint =
  data[0];

const hasInteriorRevenueMaximum =
  maximumRevenueQuantity >
    firstDataPoint.quantity &&
  maximumRevenueQuantity <
    lastDataPoint.quantity;
  /*
   * ========================================
   * CURRENT FIRM POSITION
   * ========================================
   */

  let currentQuantity: number;
  let currentPrice: number;

  if (isPerfectCompetition) {
    currentQuantity =
      production;

    currentPrice =
      averageMarketPrice;
  } else if (isMonopoly) {
    currentQuantity =
      production;

    currentPrice =
      priceForQuantity(
        gameState,
        production,
      );
  } else if (
    isMonopolisticCompetition
  ) {
    currentPrice =
      firmPrice;

    currentQuantity =
  quantityForMonopolisticPrice(
    gameState,
    currentPrice,
    brandStrength,
  );
  } else {
    currentPrice =
      firmPrice;

    currentQuantity =
      quantityForGenericPrice(
        currentPrice,
      );
  }

  /*
   * The firm cannot actually sell more
   * units than it produced.
   */
  const potentialUnitsSold =
    Math.min(
      currentQuantity,
      production,
    );

  const potentialRevenue =
    currentPrice *
    potentialUnitsSold;

  /*
   * ========================================
   * MARGINAL REVENUE
   * ========================================
   *
   * Estimate:
   *
   * MR = ΔTR / ΔQ
   */

  const quantityStep = 500;

  const previousQuantity =
    Math.max(
      500,
      currentQuantity -
        quantityStep,
    );

  const nextQuantity =
    Math.min(
      30000,
      currentQuantity +
        quantityStep,
    );

  const revenueForQuantity = (
    quantity: number,
  ): number => {
    let price: number;

    if (isPerfectCompetition) {
      price =
        averageMarketPrice;
    } else if (isMonopoly) {
      price =
        priceForQuantity(
          gameState,
          quantity,
        );
    } else if (
      isMonopolisticCompetition
    ) {
      price =
        priceForMonopolisticQuantity(
          gameState,
          quantity,
          brandStrength,
        );
    } else {
      price =
        genericPriceForQuantity(
          quantity,
        );
    }

    const graphPrice =
      Math.min(
        15,
        Math.max(0, price),
      );

    return (
      graphPrice *
      quantity
    );
  };

  const previousRevenue =
    revenueForQuantity(
      previousQuantity,
    );

  const nextRevenue =
    revenueForQuantity(
      nextQuantity,
    );

  let marginalRevenueEstimate =
    nextQuantity !==
    previousQuantity
      ? (nextRevenue -
          previousRevenue) /
        (nextQuantity -
          previousQuantity)
      : 0;
      if (isMonopolisticCompetition) {
  marginalRevenueEstimate =
    marginalRevenueForMonopolisticQuantity(
      gameState,
      currentQuantity,
      brandStrength,
    );
}

  const revenueTolerance = 0.05;

  const mrNearZero =
    Math.abs(
      marginalRevenueEstimate,
    ) <= revenueTolerance;

  /*
   * ========================================
   * BRAND / ADVERTISING INFORMATION
   * ========================================
   */

  const brandDemandPercent =
    (brandDemandMultiplier -
      1) *
    100;

  /*
   * Revenue gained is NOT profit gained.
   *
   * Advertising must ultimately generate
   * enough additional contribution to
   * justify its cost.
   */

  const revenueAfterAdvertisingCost =
    potentialRevenue -
    advertising;

  /*
   * ========================================
   * EXPLANATIONS
   * ========================================
   */

  let revenueExplanation: string;

if (isPerfectCompetition) {
  revenueExplanation =
    "Because your firm is a price taker, every additional unit sold adds the same market price to total revenue. Total revenue therefore rises at a constant rate.";
} else if (mrNearZero) {
  revenueExplanation =
    isMonopolisticCompetition
      ? "Your differentiated firm is near the quantity where total revenue is maximized. Marginal revenue is approximately zero. Remember that maximum revenue is not necessarily maximum profit because production and advertising also create costs."
      : "Total revenue is near its maximum. Marginal revenue is approximately zero, so additional output adds very little total revenue.";
} else if (
  marginalRevenueEstimate > 0
) {
  revenueExplanation =
    isMonopolisticCompetition
      ? "Your differentiated firm's total revenue is still rising at the current quantity. Marginal revenue is positive. Brand strength shifts demand, while price determines movement along the firm's demand curve."
      : "Total revenue is rising as quantity increases. Marginal revenue is positive.";
} else {
  revenueExplanation =
    isMonopolisticCompetition
      ? "Your differentiated firm's total revenue is falling at the current quantity. Marginal revenue is negative, meaning additional sales reduce total revenue."
      : "Total revenue is falling as quantity increases. Marginal revenue is negative.";
}

  let elasticityMessage: string;

  if (isPerfectCompetition) {
    elasticityMessage =
      "The individual competitive firm faces perfectly elastic demand at the market price.";
  } else if (
  isMonopolisticCompetition
) {
  elasticityMessage =
    `The market's baseline price elasticity is ${priceElasticity.toFixed(
      2,
    )}. In this simulation, Brand Strength shifts the differentiated firm's demand curve. Entry and exit also shift the demand facing the individual firm.`;
  } else if (
    priceElasticity > 1.05
  ) {
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
      {/* TITLE */}

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
          ? "A competitive firm sells at a constant market price, so total revenue increases proportionally with quantity sold."
          : isMonopoly
            ? "A monopolist must consider both price and quantity. Increasing output requires accepting a lower price."
            : isMonopolisticCompetition
              ? "Product differentiation affects demand and therefore total revenue. Advertising can strengthen the brand and increase demand, but advertising is also costly."
              : "Total revenue equals price multiplied by quantity sold. In an oligopoly, rival behavior will eventually affect both price and sales."}
      </Typography>

      {/* GRAPH */}

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
              domain={[
                0,
                30000,
              ]}
              label={{
                value:
                  "Quantity Sold",
                position:
                  "insideBottom",
                offset: -15,
              }}
            />

            <YAxis
              tickFormatter={(
                value,
              ) =>
                `$${(
                  Number(value) /
                  1000
                ).toFixed(0)}k`
              }
              label={{
                value:
                  "Total Revenue",
                angle: -90,
                position:
                  "insideLeft",
              }}
            />

            <Tooltip
              formatter={(value) => [
                money(
                  Number(value),
                ),
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
              stroke={
                isMonopolisticCompetition
                  ? "#a855f7"
                  : "#22c55e"
              }
              strokeWidth={4}
              dot={false}
              isAnimationActive={
                false
              }
            />

            <ReferenceLine
              x={currentQuantity}
              stroke="#facc15"
              strokeWidth={2}
              strokeDasharray="6 6"
              label={{
             value:
              "Current Quantity",
              position: "top",
               fill: "#facc15",
                }}
            />

           {!isPerfectCompetition &&
  hasInteriorRevenueMaximum && (
    <ReferenceLine
      x={
        maximumRevenueQuantity
      }
      stroke="#a78bfa"
      strokeWidth={2}
      strokeDasharray="4 4"
      label={{
        value:
          "Maximum TR",
        position:
          "insideTopRight",
        fill: "#a78bfa",
      }}
    />
  )}
          </LineChart>
        </ResponsiveContainer>
      </Box>

      {/* CURRENT VALUES */}

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
            Quantity Demanded
          </Typography>

          <Typography
            variant="h6"
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
            Potential Units Sold
          </Typography>

          <Typography
            variant="h6"
            sx={{ fontWeight: 800 }}
          >
            {Math.round(
              potentialUnitsSold,
            ).toLocaleString()}
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
            $
            {currentPrice.toFixed(
              2,
            )}
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
            {money(
              potentialRevenue,
            )}
          </Typography>
        </Box>
      </Box>

      {/* BRAND / ADVERTISING PANEL */}

      {isMonopolisticCompetition && (
        <Box
          sx={{
            mt: 3,
            p: 2.5,
            borderRadius: 2,
            bgcolor:
              "rgba(168,85,247,0.08)",
            border:
              "1px solid rgba(168,85,247,0.25)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              mb: 2,
            }}
          >
            Advertising and Revenue
          </Typography>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Advertising
              </Typography>

              <Typography
                sx={{
                  fontWeight: 800,
                }}
              >
                {money(advertising)}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Brand Strength
              </Typography>

              <Typography
                sx={{
                  fontWeight: 800,
                }}
              >
                {brandStrength.toFixed(
                  1,
                )}
                /100
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Demand Effect
              </Typography>

              <Typography
                sx={{
                  fontWeight: 800,
                }}
              >
                {brandDemandPercent >=
                0
                  ? "+"
                  : ""}
                {brandDemandPercent.toFixed(
                  1,
                )}
                %
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Revenue − Advertising
              </Typography>

              <Typography
                sx={{
                  fontWeight: 800,
                }}
              >
                {money(
                  revenueAfterAdvertisingCost,
                )}
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{
              mt: 2,
              fontWeight: 700,
            }}
          >
            Advertising ↑ → Brand
            Strength ↑ → Demand ↑ →
            Potential Revenue ↑
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            But revenue is not profit.
            Advertising is an explicit
            business cost, so the additional
            revenue generated by a stronger
            brand must be large enough to
            justify the advertising expense.
          </Typography>
        </Box>
      )}

      {/* EXPLANATION */}

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

        <Typography
          color="text.secondary"
        >
          {revenueExplanation}
        </Typography>

        <Typography
          sx={{
            mt: 2,
            fontWeight: 700,
          }}
        >
          {isPerfectCompetition
            ? "Constant Price → Constant MR → TR rises with quantity sold"
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
          Estimated Marginal Revenue:{" "}
          <strong>
            $
            {marginalRevenueEstimate.toFixed(
              2,
            )}
          </strong>
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
          when another unit is sold. When MR
          is positive, TR rises. When MR
          reaches zero, TR is maximized. When
          MR becomes negative, TR falls.
        </Typography>
      </Box>
    </Paper>
  );
}