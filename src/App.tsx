import { useState } from "react";
import {
  Alert,
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

import PolicyPanel from "./components/PolicyPanel";
import EconomicChart from "./components/EconomicChart";

import { simulateQuarter } from "./engine/simulation";

import type { GameState } from "./models/GameState";
import type { EconomicHistory } from "./models/EconomicHistory";
import type { GameEvent } from "./models/GameEvent";

const initialEconomy: GameState = {
  quarter: 1,

  gdp: 500,
  inflation: 3,
  unemployment: 5,
  debt: 300,
  approval: 60,

  incomeTax: 25,
  educationSpending: 40,
healthcareSpending: 45,
defenseSpending: 25,
infrastructureSpending: 25,
scienceSpending: 15,
  interestRate: 4.5,
};

function App() {
  const [economy, setEconomy] =
    useState<GameState>(initialEconomy);

  const [headline, setHeadline] = useState(
    "Welcome to Econ Empire. Adjust your policies and guide the economy."
  );

  const [currentEvent, setCurrentEvent] =
    useState<GameEvent | null>(null);

  const [history, setHistory] = useState<EconomicHistory[]>([
    {
      quarter: initialEconomy.quarter,
      gdp: initialEconomy.gdp,
      inflation: initialEconomy.inflation,
      unemployment: initialEconomy.unemployment,
      debt: initialEconomy.debt,
      approval: initialEconomy.approval,
    },
  ]);

  function endQuarter() {
  const result = simulateQuarter(economy);

  const nextEconomy = result.economy;
  const quarterlyEvent = result.event;

  setEconomy(nextEconomy);
  setCurrentEvent(quarterlyEvent);

  setHistory((previousHistory) => [
    ...previousHistory,
    {
      quarter: nextEconomy.quarter,
      gdp: nextEconomy.gdp,
      inflation: nextEconomy.inflation,
      unemployment: nextEconomy.unemployment,
      debt: nextEconomy.debt,
      approval: nextEconomy.approval,
    },
  ]);

  if (quarterlyEvent) {
    setHeadline(
      `${quarterlyEvent.name}: ${quarterlyEvent.description}`
    );
  } else {
    setHeadline(
      "The quarter passed without a major economic event."
    );
  }
}

  return (
    <>
      <CssBaseline />

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" fontWeight="bold">
            🌍 Econ Empire
          </Typography>

          <Typography sx={{ ml: "auto" }}>
            Quarter {economy.quarter}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Paper elevation={4} sx={{ p: 3 }}>
            <Typography
              variant="h4"
              fontWeight="bold"
              gutterBottom
            >
              Economic Dashboard
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(5, 1fr)",
                },
                gap: 2,
                mt: 2,
              }}
            >
              <EconomicStat
                label="GDP"
                value={`$${economy.gdp.toFixed(1)}B`}
              />

              <EconomicStat
                label="Inflation"
                value={`${economy.inflation.toFixed(1)}%`}
              />

              <EconomicStat
                label="Unemployment"
                value={`${economy.unemployment.toFixed(1)}%`}
              />

              <EconomicStat
                label="National Debt"
                value={`$${economy.debt.toFixed(1)}B`}
              />

              <EconomicStat
                label="Approval"
                value={`${economy.approval.toFixed(0)}%`}
              />
            </Box>
          </Paper>

          <Alert severity={currentEvent ? "warning" : "info"}>
            <Typography fontWeight="bold">
              📰 Economic News
            </Typography>

            {headline}
          </Alert>

          {currentEvent && (
            <Paper elevation={4} sx={{ p: 3 }}>
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
              >
                🎲 Quarterly Event: {currentEvent.name}
              </Typography>

              <Typography sx={{ mb: 2 }}>
                {currentEvent.description}
              </Typography>

              <Stack spacing={0.5}>
                <Typography>
                  GDP effect:{" "}
                  {formatEffect(
                    currentEvent.gdp,
                    "$",
                    " billion"
                  )}
                </Typography>

                <Typography>
                  Inflation effect:{" "}
                  {formatEffect(
                    currentEvent.inflation,
                    "",
                    "%"
                  )}
                </Typography>

                <Typography>
                  Unemployment effect:{" "}
                  {formatEffect(
                    currentEvent.unemployment,
                    "",
                    "%"
                  )}
                </Typography>

                <Typography>
                  Approval effect:{" "}
                  {formatEffect(
                    currentEvent.approval,
                    "",
                    "%"
                  )}
                </Typography>
              </Stack>
            </Paper>
          )}

          <PolicyPanel
            economy={economy}
            setEconomy={setEconomy}
          />

          <Button
            variant="contained"
            size="large"
            onClick={endQuarter}
            sx={{ alignSelf: "center", px: 6 }}
          >
            End Quarter
          </Button>

          {<EconomicChart history={history} />}
        </Stack>
      </Container>
    </>
  );
}

interface EconomicStatProps {
  label: string;
  value: string;
}

function EconomicStat({
  label,
  value,
}: EconomicStatProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        textAlign: "center",
      }}
    >
      <Typography color="text.secondary">
        {label}
      </Typography>

      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
    </Paper>
  );
}

function formatEffect(
  value: number,
  prefix: string,
  suffix: string
) {
  const sign = value > 0 ? "+" : "";

  return `${sign}${prefix}${value}${suffix}`;
}

export default App;