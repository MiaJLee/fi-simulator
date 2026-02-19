export interface SimulationInputs {
  currentAssets: string;
  currentAge: string;
  returnRate: string;
  inflationRate: string;
  monthlyIncome: string;
  monthlyExpense: string;
  incomeGrowth: string;
  targetAssets: string;
  fiExpense: string;
  simYears: string;
  crashEnabled: boolean;
  crashFrequency: string;
  crashPercent: string;
}

export interface YearlyResult {
  year: number;
  start: number;
  savings: number;
  investReturn: number;
  total: number;
  realValue: number;
}

export interface SimulationResult {
  years: YearlyResult[];
  targetYear: number;
  currentAge: number;
  monthlySavings: number;
  savingsRate: number;
  safeWithdrawalRate: number;
  targetAssets: number;
  simYears: number;
  crashEnabled: boolean;
  crashFrequency: number;
  crashPercent: number;
}

export type StatCardVariant = 'accent' | 'gold' | 'green' | 'warn';
