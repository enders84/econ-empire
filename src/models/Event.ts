export interface GameEvent {
  id: string;

  title: string;

  description: string;

  weight: number;

  effects: {
    gdp?: number;
    inflation?: number;
    unemployment?: number;
    approval?: number;
    productivity?: number;
    debt?: number;
  };
}