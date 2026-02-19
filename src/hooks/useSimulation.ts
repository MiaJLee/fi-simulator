'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { SimulationInputs, SimulationResult } from '@/types/simulation';
import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEY, DEFAULT_INPUTS } from '@/lib/constants';
import { runSimulationEngine } from '@/lib/simulation';

export function useSimulation() {
  const { value: inputs, setValue: setInputs, removeValue: removeInputs, hydrated } =
    useLocalStorage<SimulationInputs>(STORAGE_KEY, DEFAULT_INPUTS);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const initialRun = useRef(false);

  // Auto-run simulation on first hydration
  useEffect(() => {
    if (hydrated && !initialRun.current) {
      initialRun.current = true;
      const simResult = runSimulationEngine(inputs);
      if (simResult) {
        setResult(simResult);
      }
    }
  }, [hydrated, inputs]);

  const updateField = useCallback(<K extends keyof SimulationInputs>(field: K, value: SimulationInputs[K]) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  }, [setInputs]);

  const runSimulation = useCallback((): string | null => {
    const simResult = runSimulationEngine(inputs);
    if (!simResult) {
      return '현재 자산 또는 월 소득을 입력해 주세요';
    }
    setResult(simResult);
    return null;
  }, [inputs]);

  const resetAll = useCallback(() => {
    removeInputs();
    setResult(null);
  }, [removeInputs]);

  return { inputs, result, updateField, runSimulation, resetAll, hydrated };
}
