import type { Dispatch, SetStateAction } from "react";

import {
  Paper,
  Typography,
  Slider,
  Stack,
} from "@mui/material";

import type { GameState } from "../models/GameState";

interface PolicyPanelProps {
  economy: GameState;
  setEconomy: Dispatch<SetStateAction<GameState>>;
}

function PolicyPanel({
  economy,
  setEconomy,
}: PolicyPanelProps) {
  function updateValue(
    field: keyof GameState,
    value: number
  ) {
    setEconomy((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  return (
    <Paper elevation={4} sx={{ p: 3 }}>
      <Typography
        variant="h4"
        align="center"
        gutterBottom
      >
        🏛 Government Budget
      </Typography>

      <Stack spacing={3}>
        <PolicySlider
          label="Income Tax"
          value={economy.incomeTax}
          min={10}
          max={50}
          suffix="%"
          onChange={(value) =>
            updateValue("incomeTax", value)
          }
        />

        <PolicySlider
          label="🎓 Education"
          value={economy.educationSpending}
          min={0}
          max={100}
          prefix="$"
          suffix="B"
          onChange={(value) =>
            updateValue("educationSpending", value)
          }
        />

        <PolicySlider
          label="🏥 Healthcare"
          value={economy.healthcareSpending}
          min={0}
          max={100}
          prefix="$"
          suffix="B"
          onChange={(value) =>
            updateValue("healthcareSpending", value)
          }
        />

        <PolicySlider
          label="🛡️ Defense"
          value={economy.defenseSpending}
          min={0}
          max={100}
          prefix="$"
          suffix="B"
          onChange={(value) =>
            updateValue("defenseSpending", value)
          }
        />

        <PolicySlider
          label="🛣️ Infrastructure"
          value={economy.infrastructureSpending}
          min={0}
          max={100}
          prefix="$"
          suffix="B"
          onChange={(value) =>
            updateValue("infrastructureSpending", value)
          }
        />

        <PolicySlider
          label="🔬 Science"
          value={economy.scienceSpending}
          min={0}
          max={100}
          prefix="$"
          suffix="B"
          onChange={(value) =>
            updateValue("scienceSpending", value)
          }
        />

        <PolicySlider
          label="Interest Rate"
          value={economy.interestRate}
          min={0}
          max={10}
          step={0.25}
          suffix="%"
          onChange={(value) =>
            updateValue("interestRate", value)
          }
        />
      </Stack>
    </Paper>
  );
}

interface PolicySliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
  onChange: (value: number) => void;
}

function PolicySlider({
  label,
  value,
  min,
  max,
  step = 1,
  prefix = "",
  suffix = "",
  onChange,
}: PolicySliderProps) {
  return (
    <div>
      <Typography variant="h6" gutterBottom>
        {label}: {prefix}
        {value.toFixed(step < 1 ? 2 : 0)}
        {suffix}
      </Typography>

      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        valueLabelDisplay="auto"
        onChange={(_, newValue) => {
          if (typeof newValue === "number") {
            onChange(newValue);
          }
        }}
      />
    </div>
  );
}

export default PolicyPanel;