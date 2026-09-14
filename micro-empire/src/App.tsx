import { useState } from "react";

import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Slider,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";

import DemandCurve from "./components/DemandCurve";
import RevenueAnalysis from "./components/RevenueAnalysis";
import CostCurves from "./components/CostCurves";
import ProfitMaximization from "./components/ProfitMaximization";
import { ChallengePanel } from "./components/ChallengePanel";
import { CompetitionPanel } from "./components/CompetitionPanel";
import { GameModeDialog } from "./components/GameModeDialog";
import { createInitialGame } from "./data/initialGame";
import { advanceQuarter } from "./engine/advanceQuarter";
import { priceForQuantity } from "./engine/firm/calculateMarginalRevenue";
import type { GameMode } from "./models/Competition";
import type { MarketStructure } from "./models/Market";

const money = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

function App() {
  const [gameState, setGameState] = useState(createInitialGame);
  const [analysisTab, setAnalysisTab] = useState(0);

  // A new session must begin with an explicit mode selection.
  const [modeDialogOpen, setModeDialogOpen] = useState(true);

  const handlePriceChange = (
    _event: Event,
    value: number | number[],
  ) => {
    if (typeof value !== "number") {
      return;
    }

    setGameState((state) => ({
      ...state,
      firm: {
        ...state.firm,
        price: value,
      },
    }));
  };

  const handleMarketStructureChange = (
    structure: MarketStructure,
  ) => {
    setGameState((state) => {
      const updatedState = {
        ...state,
        market: {
          ...state.market,
          structure,
        },
      };

      if (structure === "Perfect Competition") {
        return {
          ...updatedState,
          firm: {
            ...updatedState.firm,
            price: updatedState.market.averageMarketPrice,
          },
        };
      }

      if (structure === "Monopoly") {
        return {
          ...updatedState,
          firm: {
            ...updatedState.firm,
            price: priceForQuantity(
              updatedState,
              updatedState.firm.production,
            ),
          },
        };
      }

      return updatedState;
    });
  };

  const handleProductionChange = (
    _event: Event,
    value: number | number[],
  ) => {
    if (typeof value !== "number") {
      return;
    }

    setGameState((state) => {
      const updatedState = {
        ...state,
        firm: {
          ...state.firm,
          production: value,
        },
      };

      if (state.market.structure === "Monopoly") {
        return {
          ...updatedState,
          firm: {
            ...updatedState.firm,
            price: priceForQuantity(updatedState, value),
          },
        };
      }

      return updatedState;
    });
  };

  const handleAdvertisingChange = (
    _event: Event,
    value: number | number[],
  ) => {
    if (typeof value !== "number") {
      return;
    }

    setGameState((state) => ({
      ...state,
      firm: {
        ...state.firm,
        advertising: value,
      },
    }));
  };

  const handleAdvanceQuarter = () => {
    setGameState((state) => advanceQuarter(state));
  };

  const handleStartChallenge = (challengeId: string) => {
    setGameState((state) => ({
      ...state,
      challenges: {
        ...state.challenges,
        activeChallengeId: challengeId,
      },
    }));
  };

  const handleReset = () => {
    setModeDialogOpen(true);
  };

  const handleSelectMode = (mode: GameMode) => {
    const newGame = createInitialGame();

    newGame.competition.mode = mode;
    newGame.competition.enabled = mode === "Tournament";

    setGameState(newGame);
    setAnalysisTab(0);
    setModeDialogOpen(false);
  };

  const isTournamentMode =
    gameState.competition.mode === "Tournament";

  const tournamentFinished =
    isTournamentMode && gameState.competition.isFinished;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              Micro Empire
            </Typography>

            <Typography color="text.secondary">
              Year {gameState.year} • Quarter {gameState.quarter} •{" "}
              {gameState.market.name} • {gameState.competition.mode} Mode
            </Typography>
          </Box>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "repeat(2, 1fr)",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            <Paper
              sx={{
                p: 3,
                minHeight: 150,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderRadius: 3,
              }}
            >
              <Typography color="text.secondary">Cash</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {money(gameState.cash)}
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 3,
                minHeight: 150,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderRadius: 3,
              }}
            >
              <Typography color="text.secondary">Revenue</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {money(gameState.firm.revenue)}
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 3,
                minHeight: 150,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderRadius: 3,
              }}
            >
              <Typography color="text.secondary">Total Costs</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {money(gameState.firm.totalCosts)}
              </Typography>
            </Paper>

            <Paper
              sx={{
                p: 3,
                minHeight: 150,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                borderRadius: 3,
              }}
            >
              <Typography color="text.secondary">Profit</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {money(gameState.firm.profit)}
              </Typography>
            </Paper>
          </Box>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              {gameState.firm.name}
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Choose the competitive environment in which your firm operates.
            </Typography>

            <FormControl fullWidth sx={{ mb: 4, maxWidth: 400 }}>
              <InputLabel>Market Structure</InputLabel>
              <Select
                value={gameState.market.structure}
                label="Market Structure"
                onChange={(event) =>
                  handleMarketStructureChange(
                    event.target.value as MarketStructure,
                  )
                }
              >
                <MenuItem value="Perfect Competition">
                  Perfect Competition
                </MenuItem>
                <MenuItem value="Monopolistic Competition">
                  Monopolistic Competition
                </MenuItem>
                <MenuItem value="Oligopoly">Oligopoly</MenuItem>
                <MenuItem value="Monopoly">Monopoly</MenuItem>
              </Select>
            </FormControl>

            <Stack spacing={4}>
              <Box>
                <Typography sx={{ fontWeight: 700 }}>
                  Price: {money(gameState.firm.price)}
                </Typography>

                <Slider
                  value={gameState.firm.price}
                  min={1}
                  max={15}
                  step={0.25}
                  onChange={handlePriceChange}
                  disabled={
                    gameState.market.structure === "Perfect Competition" ||
                    gameState.market.structure === "Monopoly"
                  }
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `$${value}`}
                />

                {gameState.market.structure === "Perfect Competition" && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    Your firm is a price taker. The market determines the price
                    at ${gameState.market.averageMarketPrice.toFixed(2)}. Choose
                    your production level instead.
                  </Typography>
                )}

                {gameState.market.structure === "Monopoly" && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1 }}
                  >
                    As a monopolist, choose your output. The market demand curve
                    determines the highest price consumers will pay for that
                    quantity.
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 700 }}>
                  Production: {gameState.firm.production.toLocaleString()} units
                </Typography>

                <Slider
                  value={gameState.firm.production}
                  min={1000}
                  max={30000}
                  step={500}
                  onChange={handleProductionChange}
                  valueLabelDisplay="auto"
                />
              </Box>

              {gameState.market.structure === "Monopolistic Competition" && (
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>
                    Advertising Budget: {money(gameState.firm.advertising)}
                  </Typography>

                  <Slider
                    value={gameState.firm.advertising}
                    min={0}
                    max={50000}
                    step={1000}
                    onChange={handleAdvertisingChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={(value) => money(value)}
                  />

                  <Box
                    sx={{
                      mt: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: "action.hover",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      Brand Strength
                    </Typography>

                    <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      {gameState.firm.brandStrength.toFixed(1)}/100
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 1 }}
                    >
                      Advertising costs money this quarter, but can strengthen
                      your brand and increase demand for your differentiated
                      product.
                    </Typography>
                  </Box>
                </Box>
              )}
            </Stack>
          </Paper>

          {isTournamentMode && <CompetitionPanel gameState={gameState} />}

          <ChallengePanel
            gameState={gameState}
            onStartChallenge={handleStartChallenge}
          />

          <Paper sx={{ p: 2 }}>
            <Typography
              variant="h5"
              sx={{ fontWeight: 800, px: 1, pt: 1 }}
            >
              Economic Analysis
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ px: 1, mt: 0.5, mb: 2 }}
            >
              Explore the economic relationships affecting your firm's
              decisions.
            </Typography>

            <Tabs
              value={analysisTab}
              onChange={(_event, newValue) => setAnalysisTab(newValue)}
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}
            >
              <Tab label="Demand" />
              <Tab label="Revenue" />
              <Tab label="Cost Curves" />
              <Tab label="MR vs. MC" />
            </Tabs>

            <Box sx={{ pt: 1 }}>
              {analysisTab === 0 && <DemandCurve gameState={gameState} />}
              {analysisTab === 1 && <RevenueAnalysis gameState={gameState} />}
              {analysisTab === 2 && <CostCurves gameState={gameState} />}
              {analysisTab === 3 && (
                <ProfitMaximization gameState={gameState} />
              )}
            </Box>
          </Paper>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                md: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            <Paper sx={{ p: 2 }}>
              <Typography color="text.secondary">Units Produced</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {gameState.firm.production.toLocaleString()}
              </Typography>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography color="text.secondary">Units Sold</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {gameState.firm.unitsSold.toLocaleString()}
              </Typography>
            </Paper>

            <Paper sx={{ p: 2 }}>
              <Typography color="text.secondary">Market Share</Typography>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {gameState.firm.marketShare.toFixed(2)}%
              </Typography>
            </Paper>
          </Box>

          <GameModeDialog
            open={modeDialogOpen}
            onClose={() => undefined}
            onSelectMode={handleSelectMode}
          />

          <Dialog
            open={tournamentFinished && !modeDialogOpen}
            maxWidth="sm"
            fullWidth
          >
            <DialogTitle sx={{ fontWeight: 800 }}>
              Tournament Complete
            </DialogTitle>

            <DialogContent>
              <Typography
                variant="h3"
                sx={{ fontWeight: 900, mb: 1 }}
              >
                {gameState.competition.score.toLocaleString()} points
              </Typography>

              <Typography color="text.secondary" sx={{ mb: 3 }}>
                You completed all {gameState.competition.totalQuarters} quarters.
                Your final score reflects your profit, market share, cash,
                completed challenges, and strategic penalties.
              </Typography>

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: 2,
                }}
              >
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography color="text.secondary">Cash</Typography>
                  <Typography sx={{ fontWeight: 800 }}>
                    {money(gameState.cash)}
                  </Typography>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography color="text.secondary">Final Profit</Typography>
                  <Typography sx={{ fontWeight: 800 }}>
                    {money(gameState.firm.profit)}
                  </Typography>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography color="text.secondary">Market Share</Typography>
                  <Typography sx={{ fontWeight: 800 }}>
                    {gameState.firm.marketShare.toFixed(2)}%
                  </Typography>
                </Paper>

                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography color="text.secondary">
                    Challenges Completed
                  </Typography>
                  <Typography sx={{ fontWeight: 800 }}>
                    {gameState.challenges.completedChallengeIds.length}
                  </Typography>
                </Paper>
              </Box>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button variant="contained" onClick={handleReset}>
                Start New Game
              </Button>
            </DialogActions>
          </Dialog>

          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              size="large"
              onClick={handleAdvanceQuarter}
              disabled={gameState.competition.isFinished}
            >
              {gameState.competition.isFinished
                ? "Tournament Finished"
                : "Advance Quarter"}
            </Button>

            <Button
              variant="outlined"
              size="large"
              onClick={handleReset}
            >
              Start New Game
            </Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
