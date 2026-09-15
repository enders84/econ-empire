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
import {
  getMonopolisticBrandMultiplier,
  getMonopolisticCompetitionMultiplier,
  priceForMonopolisticQuantity,
  quantityForMonopolisticPrice,
} from "../engine/market/monopolisticCompetition";
interface DemandCurveProps {
  gameState: GameState;
}

export default function DemandCurve({
  gameState,
}: DemandCurveProps) {
 const {
  baseDemand,
  averageMarketPrice,
  priceElasticity,
  marketSize,
  numberOfFirms,
  entryExitPressure,
  firmsEntered,
  firmsExited,
} = gameState.market;
  const {
    price: currentPrice,
    production,
    brandStrength,
    advertising,
  } = gameState.firm;

  const structure =
    gameState.market.structure;

  const isPerfectCompetition =
    structure ===
    "Perfect Competition";

  const isMonopoly =
    structure === "Monopoly";

  const isMonopolisticCompetition =
    structure ===
    "Monopolistic Competition";
  const isOligopoly =
  structure === "Oligopoly";
/*
 * ========================================
 * MONOPOLISTIC COMPETITION
 * ========================================
 *
 * Demand is calculated by the centralized
 * monopolistic-competition market engine.
 *
 * This keeps the Demand, Revenue, and
 * Profit Maximization screens consistent
 * with the actual game simulation.
 */

const brandDemandMultiplier =
  getMonopolisticBrandMultiplier(
    brandStrength,
  );

const competitionMultiplier =
  getMonopolisticCompetitionMultiplier(
    gameState,
  );

/*
 * ========================================
 * OLIGOPOLY DEMAND
 * ========================================
 *
 * Demand depends not only on the firm's
 * own price, but also on the price charged
 * by rival firms.
 */

const rivalPrice =
  Math.max(
    gameState.market.rivalPrice,
    0.01,
  );

const previousRivalPrice =
  gameState.market.previousRivalPrice;

const priceWarPressure =
  gameState.market.priceWarPressure;

const rivalReaction =
  gameState.market.rivalReaction;
/*
 * Calculate oligopoly quantity demanded
 * using the SAME logic as the market
 * engine.
 */
const quantityForOligopolyPrice = (
  price: number,
): number => {
  const safePrice =
    Math.max(price, 0.01);

  /*
   * Relative price:
   *
   * < 1 = cheaper than rivals
   * = 1 = same price
   * > 1 = more expensive
   */
  const relativePrice =
    safePrice / rivalPrice;

  /*
   * Strategic effect caused by the firm's
   * price relative to competitors.
   */
  const strategicMultiplier =
    Math.pow(
      relativePrice,
      -priceElasticity * 1.25,
    );

  /*
   * Standard market demand effect.
   */
  const marketPriceEffect =
    Math.pow(
      safePrice /
        averageMarketPrice,
      -priceElasticity,
    );

  /*
   * Combine both effects.
   *
   * The square root prevents the two price
   * effects from being counted too strongly.
   */
  const combinedPriceEffect =
    Math.sqrt(
      strategicMultiplier *
        marketPriceEffect,
    );

  return Math.min(
    marketSize,
    Math.max(
      0,
      baseDemand *
        combinedPriceEffect,
    ),
  );
};

/*
 * Strategic demand effect at the player's
 * CURRENT price.
 */
const currentRelativePrice =
  Math.max(currentPrice, 0.01) /
  rivalPrice;

const oligopolyStrategicMultiplier =
  Math.pow(
    currentRelativePrice,
    -priceElasticity * 1.25,
  );

const strategicDemandPercent =
  (oligopolyStrategicMultiplier - 1) *
  100;

/*
 * Percentage difference between our price
 * and the rival price.
 *
 * Positive = our price is above rivals.
 * Negative = our price is below rivals.
 */
const rivalPriceGapPercent =
  ((currentPrice - rivalPrice) /
    rivalPrice) *
  100;
  /*
   * ========================================
   * BUILD GRAPH DATA
   * ========================================
   */

  const data: {
    price: number;
    quantity: number;
  }[] = [];

  /*
   * PERFECT COMPETITION
   *
   * The individual firm faces perfectly
   * elastic demand at the market price.
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
        price:
          averageMarketPrice,
      });
    }
  }

  /*
   * MONOPOLY
   *
   * The monopolist faces market demand.
   * Quantity determines price.
   */
  else if (isMonopoly) {
    for (
      let quantity = 500;
      quantity <= 30000;
      quantity += 500
    ) {
      data.push({
        quantity,

        price:
          priceForQuantity(
            gameState,
            quantity,
          ),
      });
    }
  }

  /*
   * MONOPOLISTIC COMPETITION
   *
   * Firm demand is downward sloping and
   * shifts because of:
   *
   * - product differentiation
   * - advertising / brand strength
   * - entry and exit of competitors
   */
else if (
  isMonopolisticCompetition
) {
  for (
    let quantity = 0;
    quantity <= 30000;
    quantity += 500
  ) {
    const graphPrice =
      priceForMonopolisticQuantity(
        gameState,
        quantity,
        brandStrength,
      );

    data.push({
      quantity,
      price: graphPrice,
    });

    /*
     * Once demand reaches a price of zero,
     * there is no reason to continue
     * extending the economic demand curve.
     */
    if (graphPrice <= 0) {
      break;
    }
  }
}

  /*
   * OLIGOPOLY
   *
   * Temporary generic demand curve.
   */
  else {
    for (
      let price = 1;
      price <= 15;
      price += 0.25
    ) {
      data.push({
        price,

        quantity:
          quantityForOligopolyPrice(
            price,
          ),
      });
    }

    data.sort(
      (a, b) =>
        a.quantity - b.quantity,
    );
  }

  /*
   * ========================================
   * CURRENT POSITION
   * ========================================
   */

let currentQuantity = 0;
let displayedPrice =
  currentPrice;

if (isPerfectCompetition) {
  currentQuantity =
    production;

  displayedPrice =
    averageMarketPrice;
} else if (isMonopoly) {
  currentQuantity =
    production;

  displayedPrice =
    priceForQuantity(
      gameState,
      production,
    );
} else if (
  isMonopolisticCompetition
) {
  currentQuantity =
    quantityForMonopolisticPrice(
      gameState,
      currentPrice,
      brandStrength,
    );

  displayedPrice =
    currentPrice;

  displayedPrice =
    currentPrice;
} else if (isOligopoly) {
  currentQuantity =
    quantityForOligopolyPrice(
      currentPrice,
    );

  displayedPrice =
    currentPrice;
}

  /*
   * ========================================
   * DEMAND EFFECTS
   * ========================================
   */

  const brandDemandPercent =
    (brandDemandMultiplier - 1) *
    100;

  const competitionDemandPercent =
    (competitionMultiplier - 1) *
    100;

  /*
   * Combined effect is multiplicative,
   * not simply brand % + competition %.
   */
  const combinedDemandMultiplier =
    brandDemandMultiplier *
    competitionMultiplier;

  const combinedDemandPercent =
    (combinedDemandMultiplier - 1) *
    100;

  /*
   * ========================================
   * ENTRY / EXIT STATUS
   * ========================================
   */

let competitionStatus: string;

if (firmsEntered > 0) {
  competitionStatus =
    firmsEntered === 1
      ? "A new competitor entered this quarter"
      : `${firmsEntered} new competitors entered this quarter`;
} else if (firmsExited > 0) {
  competitionStatus =
    firmsExited === 1
      ? "A competitor exited this quarter"
      : `${firmsExited} competitors exited this quarter`;
} else if (entryExitPressure >= 1.5) {
  competitionStatus =
    "Strong entry pressure";
} else if (
  entryExitPressure > 0
) {
  competitionStatus =
    "Some entry pressure";
} else if (
  entryExitPressure <= -1.5
) {
  competitionStatus =
    "Strong exit pressure";
} else if (
  entryExitPressure < 0
) {
  competitionStatus =
    "Some exit pressure";
} else if (
  Math.abs(gameState.firm.profit) <= 2500
) {
  competitionStatus =
    "Long-Run Equilibrium";
} else {
  competitionStatus =
    "No current entry or exit pressure";
}

  /*
   * ========================================
   * EXPLANATIONS
   * ========================================
   */

  let marketExplanation: string;

  if (isPerfectCompetition) {
    marketExplanation =
      "Your firm is a price taker. The market determines the price, and your firm chooses how much output to produce at that price.";
  } else if (isMonopoly) {
    marketExplanation =
      "Your firm is the entire market. Producing more requires moving down the market demand curve and accepting a lower price.";
  } else if (
    isMonopolisticCompetition
  ) {
    marketExplanation =
      "Your firm sells a differentiated product. Brand strength can increase demand, while entry by competing differentiated firms gives consumers more substitutes and reduces the demand facing your individual firm.";
  } else {
    marketExplanation =
      "In an oligopoly, your firm's decisions depend on consumer demand and the reactions of a small number of major rivals.";
  }

  let elasticityExplanation: string;

  if (isPerfectCompetition) {
    elasticityExplanation =
      "The individual firm's demand is perfectly elastic because consumers can purchase an identical product from competing firms at the market price.";
} else if (
  isMonopolisticCompetition
) {
  elasticityExplanation =
    `The market's baseline price elasticity is ${priceElasticity.toFixed(
      2,
    )}. In this simulation, advertising and brand strength shift the firm's demand curve rather than directly changing its elasticity. Entry and exit also shift the demand facing the individual firm.`;
  } else if (
    priceElasticity > 1.05
  ) {
    elasticityExplanation =
      "Demand is elastic. Consumers are relatively responsive to price changes.";
  } else if (
    priceElasticity < 0.95
  ) {
    elasticityExplanation =
      "Demand is inelastic. Consumers are relatively less responsive to price changes.";
  } else {
    elasticityExplanation =
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
          ? "A perfectly competitive firm faces a horizontal demand curve at the market price, where P = D = AR = MR."
          : isMonopoly
            ? "A monopolist faces the entire market demand curve. Higher output requires accepting a lower price."
            : isMonopolisticCompetition
              ? "A differentiated firm faces downward-sloping demand. Brand strength can shift demand outward, while entry by competitors can shift the individual firm's demand inward."
              : "The firm faces downward-sloping demand, but strategic rival behavior will also influence demand in an oligopoly."}
      </Typography>

      {/* GRAPH */}

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
              domain={[
                0,
                isPerfectCompetition
                  ? 30000
                  : "dataMax",
              ]}
              label={{
                value:
                  isPerfectCompetition
                    ? "Firm Output"
                    : "Quantity Demanded",
                position:
                  "insideBottom",
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
                position:
                  "insideLeft",
              }}
            />

            <Tooltip
              formatter={(value) => [
                `$${Number(
                  value,
                ).toFixed(2)}`,

                isPerfectCompetition
                  ? "P = D = AR = MR"
                  : "Price",
              ]}
              labelFormatter={(
                quantity,
              ) =>
                `Quantity: ${Math.round(
                  Number(quantity),
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
                  : isMonopolisticCompetition
                    ? "#a855f7"
                    : "#38bdf8"
              }
              strokeWidth={4}
              dot={false}
              isAnimationActive={
                false
              }
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

      {/* CURRENT VALUES */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(2, 1fr)",
            md: isMonopolisticCompetition
              ? "repeat(5, 1fr)"
              : "repeat(3, 1fr)",
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
            $
            {displayedPrice.toFixed(
              2,
            )}
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

   {isPerfectCompetition
  ? "Firm Demand"
  : "Price Elasticity"}     <Box>
          <Typography
            variant="caption"
            color="text.secondary"
          >
            {isPerfectCompetition
              ? "Firm Demand"
              : isMonopolisticCompetition
                ? "Effective Elasticity"
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

        {isMonopolisticCompetition && (
          <>
            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Brand Strength
              </Typography>

              <Typography
                sx={{ fontWeight: 800 }}
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
                Firms in Market
              </Typography>

              <Typography
                sx={{ fontWeight: 800 }}
              >
                {numberOfFirms}
              </Typography>
            </Box>
          </>
        )}
      </Box>

      {/* PRODUCT DIFFERENTIATION */}

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
            Product Differentiation
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
                Advertising Budget
              </Typography>

              <Typography
                sx={{ fontWeight: 800 }}
              >
                $
                {advertising.toLocaleString()}
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
                sx={{ fontWeight: 800 }}
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
                Brand Effect
              </Typography>

              <Typography
                sx={{ fontWeight: 800 }}
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
  Demand Shift
</Typography>

<Typography
  sx={{ fontWeight: 800 }}
>
  {brandDemandPercent >= 0
    ? "+"
    : ""}
  {brandDemandPercent.toFixed(1)}%
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
            Strength ↑ → Firm Demand
            shifts right
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            A stronger brand increases
            consumers' preference for your
            product. At the same price,
            consumers are willing to buy
            more from your firm.
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Advertising is also an explicit
            cost. The additional revenue
            generated by differentiation
            must be large enough to justify
            the advertising expense.
          </Typography>
        </Box>
      )}

      {/* LONG-RUN COMPETITION */}

      {isMonopolisticCompetition && (
        <Box
          sx={{
            mt: 3,
            p: 2.5,
            borderRadius: 2,
            bgcolor:
              "rgba(56,189,248,0.08)",
            border:
              "1px solid rgba(56,189,248,0.25)",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 800,
              mb: 2,
            }}
          >
            Long-Run Competition
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
                Firms in Market
              </Typography>

              <Typography
                sx={{ fontWeight: 800 }}
              >
                {numberOfFirms}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Competition Effect
              </Typography>

              <Typography
                sx={{ fontWeight: 800 }}
              >
                {competitionDemandPercent >=
                0
                  ? "+"
                  : ""}
                {competitionDemandPercent.toFixed(
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
                Entry / Exit Pressure
              </Typography>

              <Typography
                sx={{ fontWeight: 800 }}
              >
                {entryExitPressure.toFixed(
                  1,
                )}
              </Typography>
            </Box>

            <Box>
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Combined Demand Effect
              </Typography>

              <Typography
                sx={{ fontWeight: 800 }}
              >
                {combinedDemandPercent >=
                0
                  ? "+"
                  : ""}
                {combinedDemandPercent.toFixed(
                  1,
                )}
                %
              </Typography>
            </Box>
          </Box>

          <Typography
            sx={{
              mt: 2,
              fontWeight: 700,
            }}
          >
            {competitionStatus}
          </Typography>

          <Typography
  color="text.secondary"
  sx={{ mt: 1 }}
>
  {firmsEntered > 0
    ? "Sustained economic profit attracted a new differentiated competitor. With more firms and more substitutes available, the demand facing your individual firm shifts inward."
    : firmsExited > 0
      ? "Sustained economic losses caused a competitor to leave the market. With fewer firms and fewer substitutes available, the demand facing your individual firm shifts outward."
      : entryExitPressure > 0
        ? "Economic profit is creating entry pressure. If profits persist, new differentiated firms may enter, increasing competition and shifting the demand facing your individual firm inward."
        : entryExitPressure < 0
          ? "Economic losses are creating exit pressure. If losses persist, some firms may leave, reducing competition and shifting the demand facing the remaining firms outward."
          : Math.abs(gameState.firm.profit) <= 2500
  ? "Economic profit is approximately zero, so there is currently little incentive for firms to enter or exit. The market has moved toward the long-run equilibrium predicted by monopolistic competition."
  : "There is currently no accumulated entry or exit pressure. In the long run, economic profit encourages entry while economic losses encourage exit."}
</Typography>


          <Typography
            sx={{
              mt: 2,
              fontWeight: 700,
            }}
          >
            Profit → Entry → More Firms →
            Your Demand ↓
          </Typography>

          <Typography
            sx={{
              mt: 0.5,
              fontWeight: 700,
            }}
          >
            Loss → Exit → Fewer Firms →
            Your Demand ↑
          </Typography>
        </Box>
      )}
      {/* OLIGOPOLY STRATEGY */}

{isOligopoly && (
  <Box
    sx={{
      mt: 3,
      p: 2.5,
      borderRadius: 2,
      bgcolor:
        "rgba(245,158,11,0.08)",
      border:
        "1px solid rgba(245,158,11,0.25)",
    }}
  >
    <Typography
      variant="h6"
      sx={{
        fontWeight: 800,
        mb: 2,
      }}
    >
      Oligopoly Strategy
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
          Your Price
        </Typography>

        <Typography
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
          Rival Price
        </Typography>

        <Typography
          sx={{ fontWeight: 800 }}
        >
          ${rivalPrice.toFixed(2)}
        </Typography>
      </Box>

      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
        >
          Previous Rival Price
        </Typography>

        <Typography
          sx={{ fontWeight: 800 }}
        >
          $
          {previousRivalPrice.toFixed(
            2,
          )}
        </Typography>
      </Box>

      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
        >
          Price War Pressure
        </Typography>

        <Typography
          sx={{ fontWeight: 800 }}
        >
          {priceWarPressure.toFixed(
            1,
          )}
          /5
        </Typography>
      </Box>
    </Box>

    <Box
      sx={{
        mt: 3,
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          md: "repeat(2, 1fr)",
        },
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
        >
          Strategic Position
        </Typography>

        <Typography
          sx={{
            fontWeight: 800,
            mt: 0.5,
          }}
        >
          {rivalPriceGapPercent < -5
            ? "UNDERCUTTING RIVALS"
            : rivalPriceGapPercent > 5
              ? "PRICED ABOVE RIVALS"
              : "PRICES ARE CLOSE"}
        </Typography>
      </Box>

      <Box>
        <Typography
          variant="caption"
          color="text.secondary"
        >
          Strategic Demand Effect
        </Typography>

        <Typography
          sx={{
            fontWeight: 800,
            mt: 0.5,
          }}
        >
          {strategicDemandPercent >= 0
            ? "+"
            : ""}
          {strategicDemandPercent.toFixed(
            1,
          )}
          %
        </Typography>
      </Box>
    </Box>
    <Box
  sx={{
    mt: 3,
    p: 2,
    borderRadius: 2,
    bgcolor:
      "rgba(245,158,11,0.06)",
    border:
      "1px solid rgba(245,158,11,0.18)",
  }}
>
  <Typography
    variant="caption"
    color="text.secondary"
  >
    Most Recent Rival Reaction
  </Typography>

  <Typography
    sx={{
      fontWeight: 800,
      mt: 0.5,
    }}
  >
    {rivalReaction}
  </Typography>

  <Typography
    color="text.secondary"
    sx={{ mt: 1 }}
  >
    {rivalReaction === "Partial Match"
      ? "Rivals partially matched your price cut. Your temporary price advantage has narrowed."
      : rivalReaction === "Aggressive Match"
        ? "Rivals responded aggressively to your price cut. Continued undercutting can increase the risk of a price war."
        : rivalReaction === "Price War"
          ? "A price war is underway. Rivals are cutting prices aggressively, reducing the benefit of your original price advantage."
          : rivalReaction === "Rival Price Increase"
            ? "Rivals raised their prices cautiously because your firm was charging substantially more than they were."
            : "Rival pricing is currently stable. Competitors are not making a major strategic price adjustment."}
  </Typography>
</Box>
    <Typography
      sx={{
        mt: 2,
        fontWeight: 700,
      }}
    >
      {priceWarPressure >= 2
        ? "PRICE WAR IN PROGRESS"
        : priceWarPressure > 0
          ? "Rivals are responding to competitive pricing."
          : "Competitive pricing is currently stable."}
    </Typography>

    <Typography
      color="text.secondary"
      sx={{ mt: 1 }}
    >
      {rivalPriceGapPercent < -5
        ? `Your price is ${Math.abs(
            rivalPriceGapPercent,
          ).toFixed(
            1,
          )}% below the rival price. This gives your firm a temporary demand advantage, but rivals may respond by lowering their own prices.`
        : rivalPriceGapPercent > 5
          ? `Your price is ${rivalPriceGapPercent.toFixed(
              1,
            )}% above the rival price. Consumers have an incentive to switch to competing firms.`
          : "Your price is close to the rival price. Neither firm currently has a major relative-price advantage."}
    </Typography>

    <Typography
      sx={{
        mt: 2,
        fontWeight: 700,
      }}
    >
      Your Price ↓ → Demand Advantage ↑ →
      Rival Response → Price Advantage ↓
    </Typography>

    <Typography
      color="text.secondary"
      sx={{ mt: 1 }}
    >
      Unlike monopolistic competition,
      oligopoly firms are strategically
      interdependent. Your decision can
      change what competitors do next
      quarter.
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
              : isMonopolisticCompetition
                ? "Price Change → Movement Along Demand  |  Brand or Competition Change → Shift in Demand"
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
            ? "Key idea: this is the demand curve facing one competitive firm, not the entire market demand curve."
            : isMonopolisticCompetition
              ? "Key idea: changing your own price causes a movement along your firm's demand curve. Changing product differentiation or the number of competing firms shifts the entire demand curve."
              : "Key idea: a movement along the demand curve occurs when the product's own price changes. A change in another determinant of demand shifts the entire curve."}
        </Typography>
      </Box>
    </Paper>
  );
}