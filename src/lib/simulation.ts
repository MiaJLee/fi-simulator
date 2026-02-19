import type { SimulationInputs, SimulationResult, YearlyResult } from '@/types/simulation';
import { parseNum } from './formatters';

export function runSimulationEngine(inputs: SimulationInputs): SimulationResult | null {
  const currentAssets = parseNum(inputs.currentAssets);
  const currentAge = parseNum(inputs.currentAge) || 0;
  const returnRate = parseNum(inputs.returnRate) / 100;
  const inflation = parseNum(inputs.inflationRate) / 100;
  const monthlyIncome = parseNum(inputs.monthlyIncome);
  const monthlyExpense = parseNum(inputs.monthlyExpense);
  const incomeGrowth = parseNum(inputs.incomeGrowth) / 100;
  const targetAssets = parseNum(inputs.targetAssets);
  const fiExpense = parseNum(inputs.fiExpense);
  const simYears = parseNum(inputs.simYears) || 40;

  if (currentAssets <= 0 && monthlyIncome <= 0) {
    return null;
  }

  const crashEnabled = inputs.crashEnabled;
  const crashFrequency = parseNum(inputs.crashFrequency) || 0;
  const crashPercent = parseNum(inputs.crashPercent) / 100;

  const realReturn = (1 + returnRate) / (1 + inflation) - 1;
  const monthlySavings = monthlyIncome - monthlyExpense;
  const savingsRate = monthlyIncome > 0 ? (monthlySavings / monthlyIncome * 100) : 0;

  const years: YearlyResult[] = [];
  let assets = currentAssets;
  let targetYear = -1;
  let incMultiplier = 1;

  for (let y = 1; y <= simYears; y++) {
    const startAssets = assets;

    // 자산 하락기 적용: n년마다 crash
    const isCrashYear = crashEnabled && crashFrequency > 0 && y % crashFrequency === 0;
    const effectiveReturn = isCrashYear ? -crashPercent : returnRate;
    const investReturn = startAssets * effectiveReturn;

    let yearSavings: number;
    if (targetYear > 0) {
      // 목표 달성 후: 저축 없이 FI 생활비를 자산에서 차감
      const fiYearExpense = fiExpense * 12 * Math.pow(1 + inflation, y - 1);
      yearSavings = -fiYearExpense;
    } else {
      // 목표 달성 전: 소득에서 생활비를 빼고 저축
      const yearIncome = monthlyIncome * 12 * incMultiplier;
      const yearExpense = monthlyExpense * 12 * Math.pow(1 + inflation, y - 1);
      yearSavings = Math.max(yearIncome - yearExpense, 0);
    }

    assets = startAssets + yearSavings + investReturn;
    const realValue = assets / Math.pow(1 + inflation, y);

    years.push({
      year: y,
      start: startAssets,
      savings: yearSavings,
      investReturn,
      total: assets,
      realValue,
    });

    if (targetYear < 0 && assets >= targetAssets) {
      targetYear = y;
    }

    if (targetYear < 0) {
      incMultiplier *= (1 + incomeGrowth);
    }
  }

  const fiAnnualExpense = fiExpense * 12;
  const safeWithdrawalRate = targetAssets > 0 ? (fiAnnualExpense / targetAssets * 100) : 0;

  return {
    years,
    targetYear,
    currentAge,
    monthlySavings,
    savingsRate,
    safeWithdrawalRate,
    targetAssets,
    simYears,
    crashEnabled,
    crashFrequency,
    crashPercent: crashPercent * 100,
  };
}
