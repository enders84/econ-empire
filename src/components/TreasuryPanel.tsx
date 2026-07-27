import {
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import type { GameState } from "../models/GameState";
import { calculateBudget } from "../engine/calculateBudget";

interface TreasuryPanelProps {
  economy: GameState;
}

export default function TreasuryPanel({
  economy,
}: TreasuryPanelProps) {
  const budget = calculateBudget(economy);

  const balanceLabel =
    budget.budgetBalance >= 0
      ? `+$${budget.budgetBalance.toFixed(1)}B`
      : `-$${Math.abs(budget.budgetBalance).toFixed(1)}B`;

  return (
    <Paper elevation={4} sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        Treasury
      </Typography>

      <Stack spacing={1.25}>
        <Typography>
          Revenue: ${budget.revenue.toFixed(1)}B
        </Typography>

        <Typography>
          Expenses: ${budget.expenses.toFixed(1)}B
        </Typography>

        <Divider />

        <Typography
          fontWeight="bold"
          color={
            budget.budgetBalance >= 0
              ? "success.main"
              : "error.main"
          }
        >
          Budget Balance: {balanceLabel}
        </Typography>

        <Typography>
          National Debt: ${economy.debt.toFixed(1)}B
        </Typography>

        <Typography>
          Interest Payments: ${budget.interestPayments.toFixed(1)}B
        </Typography>

        <Typography>
          Debt-to-GDP: {budget.debtToGdp.toFixed(1)}%
        </Typography>
      </Stack>
    </Paper>
  );
}