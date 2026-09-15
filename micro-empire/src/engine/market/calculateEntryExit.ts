import type { GameState } from "../../models/GameState";

export interface EntryExitResult {
  numberOfFirms: number;
  entryExitPressure: number;
  firmsEntered: number;
  firmsExited: number;
}

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function calculateEntryExit(
  state: GameState,
): EntryExitResult {
  const {
    structure,
    numberOfFirms,
  } = state.market;

  const profit =
    state.firm.profit;

  /*
   * For now, entry and exit applies only
   * to Monopolistic Competition.
   */
  if (
    structure !==
    "Monopolistic Competition"
  ) {
    return {
      numberOfFirms,
      entryExitPressure: 0,
      firmsEntered: 0,
      firmsExited: 0,
    };
  }

  /*
   * ECONOMIC PROFIT CREATES ENTRY PRESSURE.
   * ECONOMIC LOSSES CREATE EXIT PRESSURE.
   */
  let pressureChange = 0;

  if (profit > 10000) {
    pressureChange = 1;
  } else if (profit > 2500) {
    pressureChange = 0.5;
  } else if (profit < -10000) {
    pressureChange = -1;
  } else if (profit < -2500) {
    pressureChange = -0.5;
  }

  /*
   * Pressure carries over between quarters.
   */
  let newPressure =
    state.market.entryExitPressure +
    pressureChange;

  /*
   * Prevent extreme values.
   */
  newPressure =
    Math.max(
      -3,
      Math.min(3, newPressure),
    );

  let newNumberOfFirms =
    numberOfFirms;

  let firmsEntered = 0;
  let firmsExited = 0;

  /*
   * ENTRY
   *
   * Sustained profits eventually attract
   * another differentiated competitor.
   */
  if (newPressure >= 2) {
    newNumberOfFirms += 1;

    firmsEntered = 1;

    newPressure -= 2;
  }

  /*
   * EXIT
   *
   * Sustained losses eventually cause
   * a competitor to leave.
   *
   * Keep at least two firms in this
   * market structure.
   */
  if (
    newPressure <= -2 &&
    newNumberOfFirms > 2
  ) {
    newNumberOfFirms -= 1;

    firmsExited = 1;

    newPressure += 2;
  }

  return {
    numberOfFirms:
      newNumberOfFirms,

    entryExitPressure:
      round(newPressure),

    firmsEntered,

    firmsExited,
  };
}