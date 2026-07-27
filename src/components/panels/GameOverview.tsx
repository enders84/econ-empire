import { Box } from "@mui/material";

import EconomicChart from "../EconomicChart";
import EconomicNewsPanel from "./EconomicNewsPanel";
import QuarterlyEventPanel from "./QuarterlyEventPanel";
import WorldNewsPanel from "./WorldNewsPanel";

import type { EconomicHistory } from "../../models/EconomicHistory";
import type { GameEvent } from "../../models/GameEvent";
import type { NewsArticle } from "../../models/NewsArticle";

interface GameOverviewProps {
  headline: string;
  currentEvent: GameEvent | null;
  news: NewsArticle | null;
  history: EconomicHistory[];
}

export default function GameOverview({
  headline,
  currentEvent,
  news,
  history,
}: GameOverviewProps) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "1fr 2fr",
        },
        gap: 3,
        mt: 3,
      }}
    >
      <Box>
        <EconomicNewsPanel message={headline} />

        <Box sx={{ mt: 3 }}>
          <WorldNewsPanel news={news} />
        </Box>

        <Box sx={{ mt: 3 }}>
          <QuarterlyEventPanel
            currentEvent={currentEvent}
          />
        </Box>
      </Box>

      <EconomicChart history={history} />
    </Box>
  );
}