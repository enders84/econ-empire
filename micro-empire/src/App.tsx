import { useState } from "react";
import {
  Alert, Box, Button, Container, Dialog, DialogActions, DialogContent,
  DialogTitle, FormControl, InputLabel, MenuItem, Paper, Select, Slider,
  Stack, Tab, Tabs, Typography,
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
import {
  fetchLeaderboard,
  submitTournamentScore,
  type LeaderboardEntry,
} from "./services/leaderboard";
import type { GameMode } from "./models/Competition";
import type { MarketStructure } from "./models/Market";

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

function App() {
  const [gameState, setGameState] = useState(createInitialGame);
  const [analysisTab, setAnalysisTab] = useState(0);
  const [modeDialogOpen, setModeDialogOpen] = useState(true);
  const [playerName, setPlayerName] = useState("");
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [submissionMessage, setSubmissionMessage] = useState("");
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState("");

  const handlePriceChange = (_event: Event, value: number | number[]) => {
    if (typeof value !== "number") return;
    setGameState((state) => ({ ...state, firm: { ...state.firm, price: value } }));
  };

  const handleMarketStructureChange = (structure: MarketStructure) => {
    setGameState((state) => {
      const updated = { ...state, market: { ...state.market, structure } };
      if (structure === "Perfect Competition") {
        return { ...updated, firm: { ...updated.firm, price: updated.market.averageMarketPrice } };
      }
      if (structure === "Monopoly") {
        return {
          ...updated,
          firm: {
            ...updated.firm,
            price: priceForQuantity(updated, updated.firm.production),
          },
        };
      }
      return updated;
    });
  };

  const handleProductionChange = (_event: Event, value: number | number[]) => {
    if (typeof value !== "number") return;
    setGameState((state) => {
      const updated = { ...state, firm: { ...state.firm, production: value } };
      if (state.market.structure === "Monopoly") {
        return { ...updated, firm: { ...updated.firm, price: priceForQuantity(updated, value) } };
      }
      return updated;
    });
  };

  const handleAdvertisingChange = (_event: Event, value: number | number[]) => {
    if (typeof value !== "number") return;
    setGameState((state) => ({
      ...state,
      firm: { ...state.firm, advertising: value },
    }));
  };

  const handleStartChallenge = (challengeId: string) => {
    setGameState((state) => ({
      ...state,
      challenges: { ...state.challenges, activeChallengeId: challengeId },
    }));
  };

  const handleReset = () => {
    setPlayerName("");
    sessionStorage.removeItem("microEmpirePlayerName");
    setModeDialogOpen(true);
  };

  const handleSelectMode = (mode: GameMode) => {
    const newGame = createInitialGame();
    newGame.competition.mode = mode;
    newGame.competition.enabled = mode === "Tournament";

    const tournamentName =
      mode === "Tournament"
        ? sessionStorage.getItem("microEmpirePlayerName")?.trim() ?? ""
        : "";

    if (mode === "Tournament" && tournamentName.length < 2) return;

    setGameState(newGame);
    setAnalysisTab(0);
    setPlayerName(tournamentName);
    setScoreSubmitted(false);
    setSubmissionStatus("idle");
    setSubmissionMessage("");
    setLeaderboardOpen(false);
    setModeDialogOpen(false);
  };

  const loadLeaderboard = async () => {
    setLeaderboardLoading(true);
    setLeaderboardError("");
    try {
      setLeaderboard(await fetchLeaderboard());
    } catch (error) {
      setLeaderboardError(
        error instanceof Error ? error.message : "Unable to load the leaderboard.",
      );
    } finally {
      setLeaderboardLoading(false);
    }
  };

  const handleOpenLeaderboard = async () => {
    setLeaderboardOpen(true);
    await loadLeaderboard();
  };

  const handleSubmitScore = async () => {
    if (playerName.trim().length < 2 || scoreSubmitted) return;
    setSubmissionStatus("submitting");
    setSubmissionMessage("");
    try {
      await submitTournamentScore({
        player_name: playerName.trim(),
        score: gameState.competition.score,
        cumulative_profit: gameState.competition.cumulativeProfit,
        cash: gameState.cash,
        market_share: gameState.firm.marketShare,
        challenges_completed: gameState.challenges.completedChallengeIds.length,
        market_structures: gameState.competition.marketStructuresUsed,
      });
      setScoreSubmitted(true);
      setSubmissionStatus("success");
      setSubmissionMessage("Score submitted to the class leaderboard.");
      await loadLeaderboard();
    } catch (error) {
      setSubmissionStatus("error");
      setSubmissionMessage(
        error instanceof Error ? error.message : "Unable to submit your score.",
      );
    }
  };

  const isTournamentMode = gameState.competition.mode === "Tournament";
  const tournamentFinished = isTournamentMode && gameState.competition.isFinished;

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
      <Container maxWidth="lg">
        <Stack spacing={3}>
          <Box>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>Micro Empire</Typography>
            <Typography color="text.secondary">
              Year {gameState.year} • Quarter {gameState.quarter} • {gameState.market.name} • {gameState.competition.mode} Mode
              {isTournamentMode && playerName ? ` • ${playerName}` : ""}
            </Typography>
          </Box>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }, gap: 2 }}>
            {[
              ["Cash", money(gameState.cash)],
              ["Revenue", money(gameState.firm.revenue)],
              ["Total Costs", money(gameState.firm.totalCosts)],
              ["Profit", money(gameState.firm.profit)],
            ].map(([label, value]) => (
              <Paper key={label} sx={{ p: 3, minHeight: 150, display: "flex", flexDirection: "column", justifyContent: "center", borderRadius: 3 }}>
                <Typography color="text.secondary">{label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>{value}</Typography>
              </Paper>
            ))}
          </Box>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>{gameState.firm.name}</Typography>
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Choose the competitive environment in which your firm operates.
            </Typography>

            <FormControl fullWidth sx={{ mb: 4, maxWidth: 400 }}>
              <InputLabel>Market Structure</InputLabel>
              <Select
                value={gameState.market.structure}
                label="Market Structure"
                onChange={(event) => handleMarketStructureChange(event.target.value as MarketStructure)}
              >
                <MenuItem value="Perfect Competition">Perfect Competition</MenuItem>
                <MenuItem value="Monopolistic Competition">Monopolistic Competition</MenuItem>
                <MenuItem value="Oligopoly">Oligopoly</MenuItem>
                <MenuItem value="Monopoly">Monopoly</MenuItem>
              </Select>
            </FormControl>

            <Stack spacing={4}>
              <Box>
                <Typography sx={{ fontWeight: 700 }}>Price: {money(gameState.firm.price)}</Typography>
                <Slider
                  value={gameState.firm.price}
                  min={1}
                  max={15}
                  step={0.25}
                  onChange={handlePriceChange}
                  disabled={["Perfect Competition", "Monopoly"].includes(gameState.market.structure)}
                  valueLabelDisplay="auto"
                  valueLabelFormat={(value) => `$${value}`}
                />
                {gameState.market.structure === "Perfect Competition" && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    Your firm is a price taker. The market determines the price at ${gameState.market.averageMarketPrice.toFixed(2)}. Choose your production level instead.
                  </Typography>
                )}
                {gameState.market.structure === "Monopoly" && (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    As a monopolist, choose your output. The market demand curve determines the highest price consumers will pay for that quantity.
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 700 }}>Production: {gameState.firm.production.toLocaleString()} units</Typography>
                <Slider value={gameState.firm.production} min={1000} max={30000} step={500} onChange={handleProductionChange} valueLabelDisplay="auto" />
              </Box>

              {gameState.market.structure === "Monopolistic Competition" && (
                <Box>
                  <Typography sx={{ fontWeight: 700 }}>Advertising Budget: {money(gameState.firm.advertising)}</Typography>
                  <Slider value={gameState.firm.advertising} min={0} max={50000} step={1000} onChange={handleAdvertisingChange} valueLabelDisplay="auto" valueLabelFormat={money} />
                  <Box sx={{ mt: 2, p: 2, borderRadius: 2, bgcolor: "action.hover" }}>
                    <Typography variant="body2" color="text.secondary">Brand Strength</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800 }}>{gameState.firm.brandStrength.toFixed(1)}/100</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Advertising costs money this quarter, but can strengthen your brand and increase demand for your differentiated product.
                    </Typography>
                  </Box>
                </Box>
              )}
            </Stack>
          </Paper>

          {isTournamentMode && <CompetitionPanel gameState={gameState} />}
          <ChallengePanel gameState={gameState} onStartChallenge={handleStartChallenge} />

          <Paper sx={{ p: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, px: 1, pt: 1 }}>Economic Analysis</Typography>
            <Typography color="text.secondary" sx={{ px: 1, mt: 0.5, mb: 2 }}>
              Explore the economic relationships affecting your firm's decisions.
            </Typography>
            <Tabs value={analysisTab} onChange={(_event, value) => setAnalysisTab(value)} variant="scrollable" scrollButtons="auto" sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              <Tab label="Demand" /><Tab label="Revenue" /><Tab label="Cost Curves" /><Tab label="MR vs. MC" />
            </Tabs>
            <Box sx={{ pt: 1 }}>
              {analysisTab === 0 && <DemandCurve gameState={gameState} />}
              {analysisTab === 1 && <RevenueAnalysis gameState={gameState} />}
              {analysisTab === 2 && <CostCurves gameState={gameState} />}
              {analysisTab === 3 && <ProfitMaximization gameState={gameState} />}
            </Box>
          </Paper>

          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" }, gap: 2 }}>
            {[
              ["Units Produced", gameState.firm.production.toLocaleString()],
              ["Units Sold", gameState.firm.unitsSold.toLocaleString()],
              ["Market Share", `${gameState.firm.marketShare.toFixed(2)}%`],
            ].map(([label, value]) => (
              <Paper key={label} sx={{ p: 2 }}>
                <Typography color="text.secondary">{label}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>{value}</Typography>
              </Paper>
            ))}
          </Box>

          <GameModeDialog open={modeDialogOpen} onClose={() => undefined} onSelectMode={handleSelectMode} />

          <Dialog open={tournamentFinished && !modeDialogOpen} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 800 }}>Tournament Complete</DialogTitle>
            <DialogContent>
              <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>{gameState.competition.score.toLocaleString()} points</Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                You completed all {gameState.competition.totalQuarters} quarters. Your final score reflects your cumulative profit, market share, cash, completed challenges, and strategic penalties.
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2, 1fr)" }, gap: 2 }}>
                {[
                  ["Cash", money(gameState.cash)],
                  ["12-Quarter Cumulative Profit", money(gameState.competition.cumulativeProfit)],
                  ["Market Share", `${gameState.firm.marketShare.toFixed(2)}%`],
                  ["Challenges Completed", gameState.challenges.completedChallengeIds.length.toString()],
                ].map(([label, value]) => (
                  <Paper key={label} variant="outlined" sx={{ p: 2 }}>
                    <Typography color="text.secondary">{label}</Typography>
                    <Typography sx={{ fontWeight: 800 }}>{value}</Typography>
                  </Paper>
                ))}
              </Box>
              <Box sx={{ mt: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>Submit to Leaderboard</Typography>
                <Typography color="text.secondary">
                  Tournament player: <b>{playerName}</b>. This name was entered before the tournament began and cannot be changed for this run.
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Market structures used: {gameState.competition.marketStructuresUsed.length > 0
                    ? gameState.competition.marketStructuresUsed.join(" → ")
                    : "None recorded"}
                </Typography>
                {submissionStatus !== "idle" && submissionMessage && (
                  <Alert severity={submissionStatus === "success" ? "success" : "error"} sx={{ mt: 2 }}>{submissionMessage}</Alert>
                )}
              </Box>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3, flexWrap: "wrap" }}>
              <Button onClick={handleOpenLeaderboard}>View Leaderboard</Button>
              <Button variant="outlined" onClick={handleSubmitScore} disabled={scoreSubmitted || submissionStatus === "submitting"}>
                {submissionStatus === "submitting" ? "Submitting..." : scoreSubmitted ? "Score Submitted" : "Submit Score"}
              </Button>
              <Button variant="contained" onClick={handleReset}>Start New Game</Button>
            </DialogActions>
          </Dialog>

          <Dialog open={leaderboardOpen} onClose={() => setLeaderboardOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 800 }}>Micro Empire Leaderboard</DialogTitle>
            <DialogContent>
              {leaderboardLoading && <Typography color="text.secondary">Loading leaderboard...</Typography>}
              {!leaderboardLoading && leaderboardError && <Alert severity="error">{leaderboardError}</Alert>}
              {!leaderboardLoading && !leaderboardError && leaderboard.length === 0 && (
                <Typography color="text.secondary">No tournament scores have been submitted yet.</Typography>
              )}
              {!leaderboardLoading && !leaderboardError && leaderboard.length > 0 && (
                <Stack spacing={1.25}>
                  {leaderboard.map((entry, index) => {
                    const previousScore = index > 0 ? leaderboard[index - 1].score : null;
                    const rank = previousScore === entry.score
                      ? leaderboard.findIndex((row) => row.score === entry.score) + 1
                      : index + 1;

                    return (
                      <Paper key={entry.id} variant="outlined" sx={{ p: 2, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
                        <Box>
                          <Typography sx={{ fontWeight: 800 }}>#{rank} {entry.player_name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Profit {money(entry.cumulative_profit)} • Market Share {Number(entry.market_share).toFixed(2)}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                            Structures: {entry.market_structures?.length > 0
                              ? entry.market_structures.join(" → ")
                              : "Not recorded"}
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 900 }}>{entry.score.toLocaleString()}</Typography>
                      </Paper>
                    );
                  })}
                </Stack>
              )}
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
              <Button onClick={loadLeaderboard}>Refresh</Button>
              <Button variant="contained" onClick={() => setLeaderboardOpen(false)}>Close</Button>
            </DialogActions>
          </Dialog>

          <Stack direction="row" spacing={2}>
            <Button variant="contained" size="large" onClick={() => setGameState((state) => advanceQuarter(state))} disabled={gameState.competition.isFinished}>
              {gameState.competition.isFinished ? "Tournament Finished" : "Advance Quarter"}
            </Button>
            <Button variant="outlined" size="large" onClick={handleReset}>Start New Game</Button>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default App;
