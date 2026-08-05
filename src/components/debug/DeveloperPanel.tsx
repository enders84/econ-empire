import {
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import type { GameState } from "../../models/GameState";

interface DeveloperPanelProps {
  gameState: GameState;
}

const money = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);

const percent = (value: number): string =>
  `${value.toFixed(2)}%`;

export default function DeveloperPanel({
  gameState,
}: DeveloperPanelProps) {
  const history = gameState.history;

  const previousPoint =
    history.length >= 2
      ? history[history.length - 2]
      : null;

  const gdpGrowth =
    previousPoint && previousPoint.gdp > 0
      ? ((gameState.economy.gdp -
          previousPoint.gdp) /
          previousPoint.gdp) *
        100
      : 0;

  return (
    <Paper sx={{ p: 2 }}>
      <Typography
        variant="h6"
        sx={{ fontWeight: 700 }}
      >
        Developer Diagnostics
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Stack spacing={1}>
        <Typography>
          Actual GDP:{" "}
          {money(gameState.economy.gdp)}
        </Typography>

        <Typography>
          Potential GDP:{" "}
          {money(gameState.economy.potentialGdp)}
        </Typography>

        <Typography>
          GDP Growth: {percent(gdpGrowth)}
        </Typography>

        <Typography>
          Output Gap:{" "}
          {percent(gameState.economy.outputGap)}
        </Typography>

        <Typography>
          Productivity:{" "}
          {gameState.economy.productivity.toFixed(4)}
        </Typography>

      </Stack>
    </Paper>
  );
}