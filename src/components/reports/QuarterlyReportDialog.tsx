import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  Typography,
} from "@mui/material";

import type { QuarterlyReport } from "../../models/QuarterlyReport";

interface QuarterlyReportDialogProps {
  open: boolean;
  report: QuarterlyReport | null;
  onClose: () => void;
}

const percent = (value: number): string =>
  `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

const money = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

export default function QuarterlyReportDialog({
  open,
  report,
  onClose,
}: QuarterlyReportDialogProps) {
  if (!report) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Quarter {report.quarter} • Year {report.year}
      </DialogTitle>

      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Economic Summary
        </Typography>

        <Typography>
          GDP Growth: {percent(report.gdpChange)}
        </Typography>

        <Typography>
          Inflation: {percent(report.inflationChange)}
        </Typography>

        <Typography>
          Unemployment: {percent(report.unemploymentChange)}
        </Typography>

        <Typography>
          Approval: {percent(report.approvalChange)}
        </Typography>

        <Typography>
          Budget Balance: {money(report.budgetBalance)}
        </Typography>

        <Typography gutterBottom>
          Debt / GDP: {report.debtToGdp.toFixed(1)}%
        </Typography>

        <Typography
          variant="h6"
          sx={{ mt: 3 }}
        >
          Highlights
        </Typography>

        <List dense>
          {report.summary.map((item) => (
            <ListItem key={item}>
              • {item}
            </ListItem>
          ))}
        </List>
      </DialogContent>

      <DialogActions>
        <Button
          variant="contained"
          onClick={onClose}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}