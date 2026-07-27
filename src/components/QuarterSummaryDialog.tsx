import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import type { GameEvent } from "../models/GameEvent";
import type { GameState } from "../models/GameState";
import type { NewsArticle } from "../models/NewsArticle";

interface Props {
  open: boolean;
  economy: GameState;
  event: GameEvent | null;
  news: NewsArticle | null;
  headline: string;
  onClose: () => void;
}

export default function QuarterSummaryDialog({
  open,
  economy,
  event,
  news,
  headline,
  onClose,
}: Props) {
  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>
        Quarter {economy.quarter} Report
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <Typography>
            📈 GDP Growth: {economy.gdp.toFixed(1)}%
          </Typography>

          <Typography>
            💵 Inflation: {economy.inflation.toFixed(1)}%
          </Typography>

          <Typography>
            👷 Unemployment: {economy.unemployment.toFixed(1)}%
          </Typography>

          <Typography>
            ⭐ Approval: {economy.approval.toFixed(0)}%
          </Typography>

          <Typography>
            💰 National Debt: ${economy.debt.toFixed(0)}B
          </Typography>

          <Divider />

          {event && (
            <>
              <Typography variant="h6">
                Major Event
              </Typography>

              <Typography fontWeight="bold">
                {event.name}
              </Typography>

              <Typography>
                {event.description}
              </Typography>

              <Divider />
            </>
          )}

          <Typography variant="h6">
            Economic Headline
          </Typography>

          <Typography>
            {headline}
          </Typography>

          {news && (
            <>
              <Divider />

              <Typography variant="h6">
                World News
              </Typography>

              <Typography fontWeight="bold">
                {news.title}
              </Typography>

              <Typography>
                {news.description}
              </Typography>
            </>
          )}
        </Stack>
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