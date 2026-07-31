import { Grid } from "@mui/material";
import type { GameState } from "../../models/GameState";
import StatusCard from "./StatusCard";

interface DashboardProps {
  gameState: GameState;
}

export default function Dashboard({
  gameState,
}: DashboardProps) {
  const debtToGdp =
    gameState.treasury.debtToGdp;

  const inflationStatus =
    gameState.economy.inflation <= 3
      ? "good"
      : gameState.economy.inflation <= 5
      ? "warning"
      : "critical";

  const unemploymentStatus =
    gameState.economy.unemployment <= 5
      ? "good"
      : gameState.economy.unemployment <= 8
      ? "warning"
      : "critical";

  const approvalStatus =
    gameState.politics.approval >= 60
      ? "good"
      : gameState.politics.approval >= 40
      ? "warning"
      : "critical";

  const debtStatus =
    debtToGdp <= 60
      ? "good"
      : debtToGdp <= 90
      ? "warning"
      : "critical";

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatusCard
          title="GDP"
          value={`$${gameState.economy.gdp.toFixed(0)}B`}
          description="Gross Domestic Product"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatusCard
          title="Inflation"
          value={`${gameState.economy.inflation.toFixed(1)}%`}
          status={inflationStatus}
          description="Annual Inflation"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatusCard
          title="Unemployment"
          value={`${gameState.economy.unemployment.toFixed(1)}%`}
          status={unemploymentStatus}
          description="Labor Market"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
        <StatusCard
          title="Approval"
          value={`${gameState.politics.approval.toFixed(0)}%`}
          status={approvalStatus}
          description="Public Support"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatusCard
          title="Debt / GDP"
          value={`${debtToGdp.toFixed(1)}%`}
          status={debtStatus}
          description="National Debt"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatusCard
          title="Budget Balance"
          value={`$${gameState.treasury.budgetBalance.toFixed(0)}B`}
          description="Quarterly Budget"
        />
      </Grid>

      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <StatusCard
          title="Interest Rate"
          value={`${gameState.policy.policyInterestRate.toFixed(2)}%`}
          description="Central Bank Rate"
        />
      </Grid>
    </Grid>
  );
}