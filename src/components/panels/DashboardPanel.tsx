import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

import type { GameState } from "../../models/GameState";

interface DashboardPanelProps {
  economy: GameState;
}

interface StatCardProps {
  label: string;
  value: string;
}

function StatCard({
  label,
  value,
}: StatCardProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        textAlign: "center",
      }}
    >
      <Typography
        variant="h6"
        color="text.secondary"
      >
        {label}
      </Typography>

      <Typography
        variant="h4"
        fontWeight="bold"
      >
        {value}
      </Typography>
    </Paper>
  );
}

export default function DashboardPanel({
  economy,
}: DashboardPanelProps) {
  const stats: StatCardProps[] = [
    {
      label: "GDP",
      value: `$${economy.gdp.toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}B`,
    },
    {
      label: "Inflation",
      value: `${economy.inflation.toFixed(1)}%`,
    },
    {
      label: "Unemployment",
      value: `${economy.unemployment.toFixed(1)}%`,
    },
    {
      label: "National Debt",
      value: `$${economy.debt.toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}B`,
    },
    {
      label: "Approval",
      value: `${economy.approval.toFixed(0)}%`,
    },
  ];

  return (
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
        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </Box>
    </Paper>
  );
}