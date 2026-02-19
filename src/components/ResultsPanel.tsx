'use client'

import { useState } from 'react'
import type { SimulationResult } from '@/types/simulation'
import ResultSummary from './ResultSummary'
import AssetChart from './AssetChart'
import ResultsTable from './ResultsTable'
import { generateResultImage } from '@/lib/imageExport'

interface ResultsPanelProps {
  result: SimulationResult
}

export default function ResultsPanel({ result }: ResultsPanelProps) {
  const [exporting, setExporting] = useState(false)

  const handleExport = async () => {
    if (exporting) return
    setExporting(true)
    try {
      const blob = await generateResultImage(result)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'fi-simulation.png'
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      console.error('Image export failed:', e)
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="animate-fade-up">
      <div className="mb-7">
        <div className="flex items-center justify-between mb-3.5">
          <div className="text-[13px] font-semibold tracking-[1.5px] uppercase text-text-muted pl-0.5">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-[5px] text-[11px] mr-2 align-middle border bg-accent-glow text-accent border-accent/20">
              ◆
            </span>
            시뮬레이션 결과
          </div>
          <button
            onClick={handleExport}
            disabled={exporting}
            className="py-1.5 px-3 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 flex items-center gap-1.5 bg-bg-card text-text-secondary border border-border-default hover:bg-bg-card-hover hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            {exporting ? '생성 중...' : '이미지 저장'}
          </button>
        </div>
        <ResultSummary result={result} />
      </div>

      <AssetChart
        years={result.years}
        targetYear={result.targetYear}
        targetAssets={result.targetAssets}
        currentAge={result.currentAge}
      />

      <ResultsTable
        years={result.years}
        targetYear={result.targetYear}
      />
    </div>
  )
}
