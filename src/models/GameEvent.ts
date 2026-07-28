export interface GameEventEffects {
  gdpPercent?: number;
  inflation?: number;
  unemployment?: number;
  approval?: number;
  debt?: number;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  effects: GameEventEffects;
}