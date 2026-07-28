import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Paper,
  Stack,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";

import PolicyPanel, {
  type PolicyDraft,
} from "./components/PolicyPanel";
import StatCard from "./components/StatCard";
import { createDefaultGameState } from "./data/initialCountries";
import { advanceQuarter } from "./engine/advanceQuarter";
import type { GameState } from "./models/GameState";
import HistoryChart from "./components/charts/HistoryChart";
import type { ChartType } from "./models/ChartType";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#10141f",
      paper: "#1a2030",
    },
    primary: {
      main: "#6ea8fe",
    },
  },
});

function createPolicies(state: GameState): PolicyDraft {
  return {
    incomeTax: state.treasury.incomeTax,
    interestRate: state.economy.interestRate,
    educationSpending: state.treasury.educationSpending,
    healthcareSpending: state.treasury.healthcareSpending,
    defenseSpending: state.treasury.defenseSpending,
    infrastructureSpending: state.treasury.infrastructureSpending,
    scienceSpending: state.treasury.scienceSpending,
  };
}

const money = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
const percent = (value: number) => `${value.toFixed(1)}%`;

function App() {
  const [gameState, setGameState] = useState<GameState>(() =>
    createDefaultGameState(),
  );

  const [policies, setPolicies] = useState<PolicyDraft>(() =>
    createPolicies(createDefaultGameState()),
  );

  const handlePolicyChange = (
    policy: keyof PolicyDraft,
    value: number,
  ) => {
    setPolicies((current) => ({
      ...current,
      [policy]: value,
    }));
  };
  const [selectedChart, setSelectedChart] =
  useState<ChartType>("gdp");
  const handleNextQuarter = () => {
    setGameState((current) => {
      const stateWithPolicies: GameState = {
        ...current,
        economy: {
          ...current.economy,
          interestRate: policies.interestRate,
        },
        treasury: {
          ...current.treasury,
          incomeTax: policies.incomeTax,
          educationSpending: policies.educationSpending,
          healthcareSpending: policies.healthcareSpending,
          defenseSpending: policies.defenseSpending,
          infrastructureSpending: policies.infrastructureSpending,
          scienceSpending: policies.scienceSpending,
        },
      };

          return advanceQuarter(stateWithPolicies);
    });
  };
  return (
    
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="static">
        <Toolbar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Econ Empire
            </Typography>

            <Typography variant="body2">
              National Economic Strategy Simulator
            </Typography>
          </Box>

          <Typography variant="h6">
            Quarter {gameState.quarter}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(4, 1fr)",
              },
              gap: 2,
            }}
          >
            <StatCard
              title="GDP"
              value={money(gameState.economy.gdp)}
            />

            <StatCard
              title="Inflation"
              value={percent(gameState.economy.inflation)}
            />

            <StatCard
              title="Unemployment"
              value={percent(gameState.economy.unemployment)}
            />

            <StatCard
              title="Interest Rate"
              value={percent(gameState.economy.interestRate)}
            />
          </Box>

          <Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      md: "repeat(4, 1fr)",
    },
    gap: 2,
  }}
>
  <StatCard
    title="National Debt"
    value={money(gameState.treasury.debt)}
  />

  <StatCard
    title="Debt-to-GDP"
    value={percent(gameState.treasury.debtToGdp)}
  />

  <StatCard
    title="Budget Balance"
    value={money(gameState.treasury.budgetBalance)}
  />

  <StatCard
    title="Approval Rating"
    value={percent(gameState.politics.approval)}
  />
</Box>

<Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      md: "repeat(5, 1fr)",
    },
    gap: 2,
  }}
>History
  <StatCard
    title="Consumption"
    value={money(gameState.economy.consumption)}
  />

  <StatCard
    title="Investment"
    value={money(gameState.economy.investment)}
  />

  <StatCard
    title="Government"
    value={money(gameState.economy.governmentSpending)}
  />

  <StatCard
    title="Exports"
    value={money(gameState.economy.exports)}
  />

  <StatCard
    title="Imports"
    value={money(gameState.economy.imports)}
  />
</Box>
      <Paper sx={{ p: 2 }}>
  <Typography variant="body1" sx={{ fontWeight: 700 }}>
    GDP Check
  </Typography>

  <Typography sx={{ color: "text.secondary" }}>
    {money(gameState.economy.consumption)} +{" "}
    {money(gameState.economy.investment)} +{" "}
    {money(gameState.economy.governmentSpending)} + ({" "}
    {money(gameState.economy.exports)} −{" "}
    {money(gameState.economy.imports)} ) ={" "}
    {money(gameState.economy.gdp)}
  </Typography>
</Paper>
<Paper sx={{ p: 3 }}>
  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
    Economic History
  </Typography>

  <Stack
    direction="row"
    spacing={1}
    sx={{
      mb: 2,
      flexWrap: "wrap",
      rowGap: 1,
    }}
  >
    <Button
      variant={selectedChart === "gdp" ? "contained" : "outlined"}
      onClick={() => setSelectedChart("gdp")}
    >
      GDP
    </Button>

    <Button
      variant={
        selectedChart === "inflation"
          ? "contained"
          : "outlined"
      }
      onClick={() => setSelectedChart("inflation")}
    >
      Inflation
    </Button>

    <Button
      variant={
        selectedChart === "unemployment"
          ? "contained"
          : "outlined"
      }
      onClick={() => setSelectedChart("unemployment")}
    >
      Unemployment
    </Button>

    <Button
      variant={selectedChart === "debt" ? "contained" : "outlined"}
      onClick={() => setSelectedChart("debt")}
    >
      Debt
    </Button>

    <Button
      variant={
        selectedChart === "budget"
          ? "contained"
          : "outlined"
      }
      onClick={() => setSelectedChart("budget")}
    >
      Budget
    </Button>

    <Button
      variant={
        selectedChart === "approval"
          ? "contained"
          : "outlined"
      }
      onClick={() => setSelectedChart("approval")}
    >
      Approval
    </Button>
  </Stack>

  <HistoryChart
    history={gameState.history}
    chartType={selectedChart}
  />
</Paper>
        <Box
  sx={{
    display: "grid",
    gridTemplateColumns: {
      xs: "1fr",
      sm: "repeat(2, 1fr)",
      md: "repeat(4, 1fr)",
    },
    gap: 2,
  }}
>
  <StatCard
    title="Tax Revenue"
    value={money(gameState.treasury.revenue)}
  />

  <StatCard
    title="Total Expenses"
    value={money(gameState.treasury.expenses)}
  />

  <StatCard
    title="Interest Payments"
    value={money(gameState.treasury.interestPayments)}
  />

  <StatCard
    title="Program Spending"
    value={money(gameState.economy.governmentSpending)}
  />
</Box>
          <PolicyPanel
            policies={policies}
            onPolicyChange={handlePolicyChange}
          />

          <Paper sx={{ p: 3 }}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              sx={{
                alignItems: {
                  xs: "stretch",
                  sm: "center",
                },
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Advance the Simulation
                </Typography>

                <Typography sx={{ color: "text.secondary" }}>
                  Apply the selected policies and simulate the next quarter.
                </Typography>
              </Box>

              <Button
                variant="contained"
                size="large"
                onClick={handleNextQuarter}
              >
                Advance Quarter
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </ThemeProvider>
  );
}

export default App;