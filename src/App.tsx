import Dashboard from "./components/dashboard/Dashboard";
import { useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Container,
  CssBaseline,
  Paper,
  Stack,
  Tab,
  Tabs,
  ThemeProvider,
  Toolbar,
  Typography,
  createTheme,
} from "@mui/material";

import HistoryChart from "./components/HistoryChart";
import PolicyPanel, {
  type PolicyDraft,
} from "./components/PolicyPanel";
import StatCard from "./components/StatCard";
import { createDefaultGameState } from "./data/initialCountries";
import { advanceQuarter } from "./engine/advanceQuarter";
import type { GameState } from "./models/GameState";
import QuarterlyReportDialog from "./components/reports/QuarterlyReportDialog";
import { generateQuarterlyReport } from "./engine/reports/generateQuarterlyReport";
import type { QuarterlyReport } from "./models/QuarterlyReport";
import DeveloperPanel from "./components/debug/DeveloperPanel";
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

const percent = (value: number): string =>
  `${value.toFixed(1)}%`;

function App() {
  const [gameState, setGameState] = useState<GameState>(() =>
    createDefaultGameState(),
  );

  const [policies, setPolicies] = useState<PolicyDraft>(() =>
    createPolicies(createDefaultGameState()),
  );

  const [chartTab, setChartTab] = useState(0);

  const handlePolicyChange = (
    policy: keyof PolicyDraft,
    value: number,
  ) => {
    setPolicies((current) => ({
      ...current,
      [policy]: value,
    }));
  };
const [quarterlyReport, setQuarterlyReport] =
  useState<QuarterlyReport | null>(null);

const [reportOpen, setReportOpen] =
  useState(false);

  const handleNextQuarter = () => {
  const stateWithPolicies: GameState = {
    ...gameState,

    policy: {
      incomeTaxRate: policies.incomeTax,

      educationBudget: policies.educationSpending,
      healthcareBudget: policies.healthcareSpending,
      defenseBudget: policies.defenseSpending,
      infrastructureBudget:
        policies.infrastructureSpending,
      scienceBudget: policies.scienceSpending,

      policyInterestRate: policies.interestRate,
    },

    economy: {
      ...gameState.economy,
      interestRate: policies.interestRate,
    },

    treasury: {
      ...gameState.treasury,
      incomeTax: policies.incomeTax,
      educationSpending: policies.educationSpending,
      healthcareSpending: policies.healthcareSpending,
      defenseSpending: policies.defenseSpending,
      infrastructureSpending:
        policies.infrastructureSpending,
      scienceSpending: policies.scienceSpending,
    },
  };

  const nextState = advanceQuarter(stateWithPolicies);

  const report = generateQuarterlyReport(
    gameState,
    nextState,
  );

  setGameState(nextState);
  setQuarterlyReport(report);
  setReportOpen(true);
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

          <Box sx={{ textAlign: "right" }}>
            <Typography variant="h6">
              Year {gameState.politics.currentYear}, Quarter{" "}
              {gameState.quarter}
            </Typography>

            <Typography variant="body2">
              Approval: {percent(gameState.politics.approval)}
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Dashboard gameState={gameState} />
          <DeveloperPanel gameState={gameState} />
          {/* GDP components */}
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
          >
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
              value={money(
                gameState.economy.governmentSpending,
              )}
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

          {/* GDP formula */}
          <Paper sx={{ p: 2 }}>
            <Typography
              variant="body1"
              sx={{ fontWeight: 700 }}
            >
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

          {/* Treasury details */}
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
              value={money(
                gameState.treasury.interestPayments,
              )}
            />

            <StatCard
              title="Program Spending"
              value={money(
                gameState.economy.governmentSpending,
              )}
            />
          </Box>

          {/* Tabbed charts */}
          <Paper sx={{ overflow: "hidden" }}>
            <Tabs
              value={chartTab}
              onChange={(_, newValue: number) =>
                setChartTab(newValue)
              }
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                px: 2,
              }}
            >
              <Tab label="Economy" />
              <Tab label="Labor" />
              <Tab label="Treasury" />
              <Tab label="Politics" />
            </Tabs>

            <Box sx={{ p: 3 }}>
              {chartTab === 0 && (
                <HistoryChart
                  title="GDP Over Time"
                  data={gameState.history}
                  lines={[
                    {
                      dataKey: "gdp",
                      label: "GDP",
                    },
                  ]}
                />
              )}

              {chartTab === 1 && (
                <HistoryChart
                  title="Inflation and Unemployment"
                  data={gameState.history}
                  lines={[
                    {
                      dataKey: "inflation",
                      label: "Inflation",
                    },
                    {
                      dataKey: "unemployment",
                      label: "Unemployment",
                    },
                  ]}
                />
              )}

              {chartTab === 2 && (
                <HistoryChart
                  title="National Debt"
                  data={gameState.history}
                  lines={[
                    {
                      dataKey: "debt",
                      label: "Debt",
                    },
                  ]}
                />
              )}

              {chartTab === 3 && (
                <HistoryChart
                  title="Approval Rating"
                  data={gameState.history}
                  lines={[
                    {
                      dataKey: "approval",
                      label: "Approval",
                    },
                  ]}
                />
              )}
            </Box>
          </Paper>

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
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700 }}
                >
                  Advance the Simulation
                </Typography>

                <Typography sx={{ color: "text.secondary" }}>
                  Apply the selected policies and simulate the
                  next quarter.
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

      <QuarterlyReportDialog
        open={reportOpen}
        report={quarterlyReport}
        onClose={() => setReportOpen(false)}
      />
    </ThemeProvider>
  );
}

export default App;