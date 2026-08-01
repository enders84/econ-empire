import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  Paper,
  Typography,
} from "@mui/material";

import type { QuarterlyReport } from "../../models/QuarterlyReport";

interface QuarterlyReportDialogProps {
  open: boolean;
  report: QuarterlyReport | null;
  onClose: () => void;
}

type MetricTone = "positive" | "negative" | "neutral";

interface ReportMetricProps {
  label: string;
  value: string;
  tone?: MetricTone;
  helperText?: string;
}

const percentChange = (value: number): string =>
  `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;

const money = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

function getToneColor(tone: MetricTone): string {
  if (tone === "positive") {
    return "success.main";
  }

  if (tone === "negative") {
    return "error.main";
  }

  return "text.primary";
}

function getStandardChangeTone(
  value: number,
): MetricTone {
  if (value > 0) {
    return "positive";
  }

  if (value < 0) {
    return "negative";
  }

  return "neutral";
}

function getInflationTone(
  value: number,
): MetricTone {
  if (value < 0) {
    return "positive";
  }

  if (value > 0) {
    return "negative";
  }

  return "neutral";
}

function getUnemploymentTone(
  value: number,
): MetricTone {
  if (value < 0) {
    return "positive";
  }

  if (value > 0) {
    return "negative";
  }

  return "neutral";
}

function ReportMetric({
  label,
  value,
  tone = "neutral",
  helperText,
}: ReportMetricProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 2,
        height: "100%",
        backgroundColor: "background.default",
      }}
    >
      <Typography
        variant="body2"
        sx={{
          color: "text.secondary",
          fontWeight: 700,
        }}
      >
        {label}
      </Typography>

      <Typography
        variant="h5"
        sx={{
          mt: 0.5,
          fontWeight: 800,
          color: getToneColor(tone),
        }}
      >
        {value}
      </Typography>

      {helperText && (
        <Typography
          variant="caption"
          sx={{
            display: "block",
            mt: 0.5,
            color: "text.secondary",
          }}
        >
          {helperText}
        </Typography>
      )}
    </Paper>
  );
}

export default function QuarterlyReportDialog({
  open,
  report,
  onClose,
}: QuarterlyReportDialogProps) {
  if (!report) {
    return null;
  }

  const budgetTone: MetricTone =
    report.budgetBalance > 0
      ? "positive"
      : report.budgetBalance < 0
        ? "negative"
        : "neutral";

  const debtTone: MetricTone =
    report.debtToGdp <= 60
      ? "positive"
      : report.debtToGdp <= 90
        ? "neutral"
        : "negative";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle
        sx={{
          pb: 1,
        }}
      >
        <Typography
          variant="overline"
          sx={{
            color: "primary.main",
            fontWeight: 800,
            letterSpacing: 1.2,
          }}
        >
          Quarterly Economic Report
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontWeight: 800,
          }}
        >
          Year {report.year} • Quarter {report.quarter}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 2,
            mt: 1,
          }}
        >
          <ReportMetric
            label="GDP Growth"
            value={percentChange(report.gdpChange)}
            tone={getStandardChangeTone(report.gdpChange)}
            helperText="Change from the previous quarter"
          />

          <ReportMetric
            label="Inflation Change"
            value={percentChange(report.inflationChange)}
            tone={getInflationTone(report.inflationChange)}
            helperText="Quarter-over-quarter movement"
          />

          <ReportMetric
            label="Unemployment Change"
            value={percentChange(
              report.unemploymentChange,
            )}
            tone={getUnemploymentTone(
              report.unemploymentChange,
            )}
            helperText="Change in the unemployment rate"
          />

          <ReportMetric
            label="Approval Change"
            value={percentChange(report.approvalChange)}
            tone={getStandardChangeTone(
              report.approvalChange,
            )}
            helperText="Movement in public support"
          />

          <ReportMetric
            label="Budget Balance"
            value={money(report.budgetBalance)}
            tone={budgetTone}
            helperText={
              report.budgetBalance >= 0
                ? "Quarterly surplus"
                : "Quarterly deficit"
            }
          />

          <ReportMetric
            label="Debt-to-GDP"
            value={`${report.debtToGdp.toFixed(1)}%`}
            tone={debtTone}
            helperText="National debt relative to GDP"
          />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography
          variant="h6"
          sx={{
            fontWeight: 800,
          }}
        >
          Highlights
        </Typography>

        {report.summary.length > 0 ? (
          <List
            dense
            sx={{
              mt: 1,
            }}
          >
            {report.summary.map((item, index) => (
              <ListItem
                key={`${item}-${index}`}
                sx={{
                  px: 0,
                  alignItems: "flex-start",
                }}
              >
                <Box
                  component="span"
                  sx={{
                    color: "primary.main",
                    fontWeight: 800,
                    mr: 1,
                  }}
                >
                  •
                </Box>

                <Typography variant="body1">
                  {item}
                </Typography>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography
            sx={{
              mt: 1,
              color: "text.secondary",
            }}
          >
            No major changes were recorded this quarter.
          </Typography>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
        }}
      >
        <Button
          variant="contained"
          size="large"
          onClick={onClose}
        >
          Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
}