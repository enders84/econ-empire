import {
  Box,
  Paper,
  Slider,
  Stack,
  Typography,
} from "@mui/material";

import type { GameState } from "../models/GameState";

export type PolicyField =
  | "incomeTax"
  | "educationSpending"
  | "healthcareSpending"
  | "defenseSpending"
  | "infrastructureSpending"
  | "scienceSpending"
  | "interestRate";

interface PolicyPanelProps {
  economy: GameState;
  onPolicyChange: (
    field: PolicyField,
    value: number
  ) => void;
}

interface PolicyDefinition {
  field: PolicyField;
  label: string;
  min: number;
  max: number;
  step?: number;
  prefix?: string;
  suffix?: string;
}

const policyDefinitions: PolicyDefinition[] = [
  {
    field: "incomeTax",
    label: "Income Tax",
    min: 10,
    max: 50,
    suffix: "%",
  },
  {
    field: "educationSpending",
    label: "🎓 Education",
    min: 0,
    max: 100,
    prefix: "$",
    suffix: "B",
  },
  {
    field: "healthcareSpending",
    label: "🏥 Healthcare",
    min: 0,
    max: 100,
    prefix: "$",
    suffix: "B",
  },
  {
    field: "defenseSpending",
    label: "🛡️ Defense",
    min: 0,
    max: 100,
    prefix: "$",
    suffix: "B",
  },
  {
    field: "infrastructureSpending",
    label: "🛣️ Infrastructure",
    min: 0,
    max: 100,
    prefix: "$",
    suffix: "B",
  },
  {
    field: "scienceSpending",
    label: "🔬 Science",
    min: 0,
    max: 100,
    prefix: "$",
    suffix: "B",
  },
  {
    field: "interestRate",
    label: "Interest Rate",
    min: 0,
    max: 10,
    step: 0.25,
    suffix: "%",
  },
];

export default function PolicyPanel({
  economy,
  onPolicyChange,
}: PolicyPanelProps) {
  return (
    <Paper elevation={4} sx={{ p: 3 }}>
      <Typography
        variant="h4"
        align="center"
        fontWeight="bold"
        gutterBottom
      >
        🏛 Government Policy
      </Typography>

      <Typography
        align="center"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        Adjust taxes, spending, and interest rates
        before ending the quarter.
      </Typography>

      <Stack spacing={3}>
        {policyDefinitions.map((policy) => (
          <PolicySlider
            key={policy.field}
            label={policy.label}
            value={economy[policy.field]}
            min={policy.min}
            max={policy.max}
            step={policy.step}
            prefix={policy.prefix}
            suffix={policy.suffix}
            onChange={(value) =>
              onPolicyChange(policy.field, value)
            }
          />
        ))}
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
  function formatValue(numberValue: number) {
    const formattedNumber =
      numberValue.toLocaleString("en-US", {
        maximumFractionDigits:
          step < 1 ? 2 : 0,
      });

    return `${prefix}${formattedNumber}${suffix}`;
  }

  return (
    <Box>
      <Typography
        variant="h6"
        component="div"
        gutterBottom
      >
        {label}: {formatValue(value)}
      </Typography>

      <Slider
        value={value}
        min={min}
        max={max}
        step={step}
        valueLabelDisplay="auto"
        valueLabelFormat={formatValue}
        aria-label={label}
        onChange={(_, newValue) => {
          if (typeof newValue === "number") {
            onChange(newValue);
          }
        }}
      />
    </Box>
  );
}