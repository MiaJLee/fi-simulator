import type { SimulationInputs } from '@/types/simulation';

export const STORAGE_KEY = 'fi_simulator_data';

export const INPUT_FIELD_KEYS: (keyof SimulationInputs)[] = [
  'currentAssets', 'currentAge', 'returnRate', 'inflationRate',
  'monthlyIncome', 'monthlyExpense', 'incomeGrowth',
  'targetAssets', 'fiExpense', 'simYears',
  'crashEnabled', 'crashFrequency', 'crashPercent',
];

export const DEFAULT_INPUTS: SimulationInputs = {
  currentAssets: '5000',
  currentAge: '30',
  returnRate: '7',
  inflationRate: '3',
  monthlyIncome: '500',
  monthlyExpense: '250',
  incomeGrowth: '3',
  targetAssets: '100000',
  fiExpense: '300',
  simYears: '30',
  crashEnabled: false,
  crashFrequency: '7',
  crashPercent: '30',
};

// Canvas chart colors (Canvas API cannot read CSS variables)
// Point colors: teal-blue #4a8fa6, green #4d7a42, warm-brown #a67040
export const CHART_COLORS = {
  grid: 'rgba(12,12,9,0.08)',
  label: '#7c7c67',
  targetLine: 'rgba(77,122,66,0.4)',
  targetDot: '#4d7a42',
  targetText: '#4d7a42',
  realValueArea: 'rgba(166,112,64,0.12)',
  realValueLine: 'rgba(166,112,64,0.75)',
  totalAreaTop: 'rgba(74,143,166,0.14)',
  totalAreaBottom: 'rgba(74,143,166,0)',
  totalLine: '#4a8fa6',
  dotStroke: '#ffffff',
  legendBlue: '#4a8fa6',
  legendGold: '#a67040',
  legendText: '#7c7c67',
} as const;
