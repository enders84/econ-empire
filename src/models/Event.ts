export interface GameEvent {
  id: string;

  title: string;

  description: string;

  probability: number;

  effects: {
    gdp?: number;
    inflation?: number;
    unemployment?: number;
    approval?: number;
    productivity?: number;
    debt?: number;
  };
}