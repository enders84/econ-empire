import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";

import EconomicChart from "./components/EconomicChart";
import HomeScreen from "./components/HomeScreen";
import NewGameScreen from "./components/NewGameScreen";
import PolicyPanel, {
  type PolicyField,
} from "./components/PolicyPanel";
import DashboardPanel from "./components/panels/DashboardPanel";
import EconomicNewsPanel from "./components/panels/EconomicNewsPanel";
import QuarterlyEventPanel from "./components/panels/QuarterlyEventPanel";
import WorldNewsPanel from "./components/panels/WorldNewsPanel";
import TreasuryPanel from "./components/TreasuryPanel";
import { countries } from "./data/countries";

import { holdElection } from "./engine/politics/election.ts";
import { simulateQuarter } from "./engine/simulation";
import { getRandomNews } from "./engine/world/news";

import type { EconomicHistory } from "./models/EconomicHistory";
import type { ElectionResult } from "./models/Election";
import type { GameEvent } from "./models/GameEvent";
import type { GameState } from "./models/GameState";
import type { NewsArticle } from "./models/NewsArticle";
type GameScreen =
  | "home"
  | "new-game"
  | "single-player"
  | "multiplayer";

const ELECTION_INTERVAL = 16;

const DEFAULT_HEADLINE =
  "Welcome to Econ Empire. Adjust your policies and guide the economy.";

const initialEconomy: GameState = {
  quarter: 1,

  gdp: 500,
  inflation: 2.5,
  unemployment: 5,
  debt: 300,
  approval: 60,
  revenue: 0,
  expenses: 0,
  budgetBalance: 0,
  interestPayments: 0,
  debtToGdp: 0,
  incomeTax: 25,

  educationSpending: 40,
  healthcareSpending: 45,
  defenseSpending: 25,
  infrastructureSpending: 25,
  scienceSpending: 15,

  interestRate: 3,
};

function createHistoryRecord(
  economy: GameState
): EconomicHistory {
  return {
    quarter: economy.quarter,
    gdp: economy.gdp,
    inflation: economy.inflation,
    unemployment: economy.unemployment,
    debt: economy.debt,
    approval: economy.approval,
  };
}

function App() {
  const [gameScreen, setGameScreen] =
    useState<GameScreen>("home");

  const [economy, setEconomy] =
    useState<GameState>(initialEconomy);

  const [selectedCountry, setSelectedCountry] =
    useState("United States");

  const [leaderName, setLeaderName] =
    useState("");

  const [difficulty, setDifficulty] =
    useState("Student");

  const [headline, setHeadline] =
    useState(DEFAULT_HEADLINE);

  const [news, setNews] =
    useState<NewsArticle | null>(() =>
      getRandomNews()
    );

  const [currentEvent, setCurrentEvent] =
    useState<GameEvent | null>(null);

  const [electionResult, setElectionResult] =
    useState<ElectionResult | null>(null);

  const [history, setHistory] = useState<
    EconomicHistory[]
  >([
    createHistoryRecord(initialEconomy),
  ]);

 function endQuarter(): void {
  const simulationResult =
    simulateQuarter(economy);

  const nextEconomy =
    simulationResult.economy;

  const quarterlyEvent =
    simulationResult.event;

  setEconomy(nextEconomy);
  setCurrentEvent(quarterlyEvent);
  setNews(getRandomNews());

  setHistory((previousHistory) => [
    ...previousHistory,
    createHistoryRecord(nextEconomy),
  ]);

  if (
    nextEconomy.quarter %
      ELECTION_INTERVAL ===
    0
  ) {
    const result =
      holdElection(nextEconomy);

    setElectionResult(result);
  } else {
    setElectionResult(null);
  }

  if (quarterlyEvent) {
    setHeadline(
      `${quarterlyEvent.name}: ${quarterlyEvent.description}`
    );
  } else {
    setHeadline(
      "The quarter passed without a major economic event."
    );
  }

  setSummaryOpen(true);
}
function handlePolicyChange(
  field: PolicyField,
  value: number
): void {
  setEconomy((previousEconomy) => ({
    ...previousEconomy,
    [field]: value,
  }));
}

  function startNewGame(
    country: string,
    newLeaderName: string,
    newDifficulty: string
  ): void {
    const startingEconomy =
      countries[country] ??
      initialEconomy;

    const newEconomy: GameState = {
      ...startingEconomy,
      quarter: 1,
    };

    setSelectedCountry(country);
    setLeaderName(newLeaderName);
    setDifficulty(newDifficulty);

    setEconomy(newEconomy);

    setHistory([
      createHistoryRecord(newEconomy),
    ]);

    setCurrentEvent(null);
  setElectionResult(null);
  setNews(getRandomNews());

    setHeadline(
      `Welcome, ${
        newLeaderName.trim() || "Leader"
      }. You are now leading ${country}.`
    );

    setGameScreen("single-player");
  }

  function returnToMainMenu(): void {
    setGameScreen("home");
  }

if (gameScreen === "home") {
  return (
    <>
      <CssBaseline />

      <HomeScreen
        onSinglePlayer={() =>
          setGameScreen("new-game")
        }
        onMultiplayer={() =>
          setGameScreen("multiplayer")
        }
      />
    </>
  );
}

  if (gameScreen === "new-game") {
    return (
      <>
        <CssBaseline />

        <NewGameScreen
          onStartGame={startNewGame}
        />
      </>
    );
  }

  if (gameScreen === "multiplayer") {
    return (
      <>
        <CssBaseline />

        <Box
          sx={{
            minHeight: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#eef5ff",
            px: 2,
          }}
        >
          <Paper
            elevation={6}
            sx={{
              p: 5,
              width: 500,
              maxWidth: "100%",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
            >
              Multiplayer Classroom
            </Typography>

            <Typography sx={{ mb: 3 }}>
              Classroom multiplayer is
              currently under development.
            </Typography>

            <Button
              variant="contained"
              onClick={returnToMainMenu}
            >
              Return to Main Menu
            </Button>
          </Paper>
        </Box>
      </>
    );
  }

 return (
  <>
    <CssBaseline />

    <AppBar position="static">
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Typography variant="h5">
          🌍 Econ Empire
        </Typography>

        <Box sx={{ textAlign: "right" }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
          >
            {selectedCountry}
          </Typography>

          <Typography variant="body2">
            Leader: {leaderName || "Unknown"}
          </Typography>

          <Typography variant="body2">
            Difficulty: {difficulty}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>

    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <DashboardPanel economy={economy} />
        <TreasuryPanel economy={economy} />
        <EconomicNewsPanel headline={headline} />

        {currentEvent && (
          <QuarterlyEventPanel
            event={currentEvent}
          />
        )}

        {news && (
          <WorldNewsPanel news={news} />
        )}

        <PolicyPanel
  economy={economy}
  onPolicyChange={handlePolicyChange}
/>

        <Button
          variant="contained"
          size="large"
          onClick={endQuarter}
        >
          End Quarter
        </Button>

        {electionResult && (
          <Paper elevation={6} sx={{ p: 4 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
            >
              🗳 Election Results
            </Typography>

            <Typography
              variant="h6"
              color={
                electionResult.playerWon
                  ? "success.main"
                  : "error.main"
              }
            >
              {electionResult.playerWon
                ? "You were reelected!"
                : "You lost the election."}
            </Typography>

            <Typography sx={{ mt: 2 }}>
              {electionResult.message}
            </Typography>
          </Paper>
        )}

        <EconomicChart history={history} />

        <Button
          variant="outlined"
          onClick={returnToMainMenu}
        >
          Return to Main Menu
        </Button>
      </Stack>
    </Container>
      </>
);
}

export default App;