# Econ Empire

**Econ Empire** is an educational economic strategy game where players manage a fictional economy, make policy decisions, and observe the consequences over time.

The goal is to create a game that is fun enough to play and rigorous enough to teach economics through experimentation.

## Project Status

**Current version:** `0.0.1`
**Development stage:** Early prototype

## Core Gameplay Loop

1. Review the current economic conditions.
2. Read the quarterly economic briefing.
3. Select an economic policy.
4. Advance to the next quarter.
5. Observe changes in GDP, inflation, unemployment, debt, and public approval.
6. Read a plain-English explanation of why the economy changed.

## Initial Prototype

The first playable prototype will allow the player to:

* Start a new game
* View an economic dashboard
* Read a news event
* Choose one policy
* End the quarter
* See the economy update
* Read an economic explanation
* Continue playing additional quarters

## Initial Economic Indicators

* Gross Domestic Product
* GDP growth
* Inflation
* Unemployment
* Interest rates
* Government debt
* Government treasury
* Consumer confidence
* Business confidence
* Public approval

## Initial Policies

* Lower income taxes
* Raise income taxes
* Increase infrastructure spending
* Increase education spending
* Raise interest rates
* Lower interest rates

## Technology

The initial browser prototype will use:

* React
* TypeScript
* Vite
* CSS
* Chart.js or Recharts
* Vitest
* Git and GitHub

The economic simulation engine will be written in TypeScript and developed separately from the user interface.

## ECOCORE

**ECOCORE** is the economic simulation engine behind Econ Empire.

Its responsibilities include:

* Maintaining the current game state
* Applying player policies
* Processing delayed policy effects
* Simulating quarterly economic changes
* Processing economic events
* Updating government finances
* Generating economic explanations
* Returning simulation results to the interface

The user interface will display information but will not perform economic calculations.

## Starting Economy

The first scenario takes place in the fictional **Republic of Econia**.

Initial conditions:

* Population: 10 million
* GDP: $500 billion
* Inflation: 2.0%
* Unemployment: 5.0%
* Interest rate: 3.0%
* Government debt: $200 billion
* Public approval: 60%

## Development Principles

1. Every major feature should demonstrate an economic concept.
2. Economic calculations belong in ECOCORE, not the user interface.
3. The simulation should be deterministic unless a random event is intentionally triggered.
4. Policies and events should eventually be stored in editable data files.
5. Every important economic change should include a plain-English explanation.
6. The first prototype should remain small and playable.

## Planned Project Structure

```text
econ-empire/
├── docs/
├── public/
├── src/
│   ├── data/
│   ├── engine/
│   ├── simulation/
│   └── ui/
├── tests/
├── README.md
├── package.json
└── tsconfig.json
```

## Roadmap

### Version 0.0.1

* Create repository
* Create project structure
* Define the initial game state
* Build the first ECOCORE simulation function

### Version 0.0.2

* Add economic policies
* Add quarterly simulation
* Generate economic reports

### Version 0.1.0

* Playable browser prototype
* Dashboard
* Policy selection
* End-quarter button
* Economic explanations
* Basic charts

### Future Versions

* Random events
* Advisors
* Elections
* Industries
* Households and firms
* Historical scenarios
* Professor Mode
* Career Mode
* Save and load system

## Long-Term Vision

Econ Empire may eventually become:

* A browser-based strategy game
* A downloadable desktop game
* A classroom economics simulation
* A tool for professors to create economic scenarios
* An open-source educational economics project

## License

A license has not yet been selected.

## Creator

Created by Michael Quintana.

