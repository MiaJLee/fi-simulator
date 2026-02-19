import type { SimulationResult } from '@/types/simulation'
import StatCard from './StatCard'
import { fmt } from '@/lib/formatters'

interface ResultSummaryProps {
	result: SimulationResult
}

export default function ResultSummary({ result }: ResultSummaryProps) {
	const {
		years,
		targetYear,
		currentAge,
		monthlySavings,
		savingsRate,
		safeWithdrawalRate,
		targetAssets,
		simYears,
	} = result
	const lastYear = years[years.length - 1]

	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
			<StatCard
				label="월 저축액"
				value={`${fmt(monthlySavings)} 만원`}
				sub={`저축률 ${savingsRate.toFixed(1)}%`}
				variant="accent"
			/>
			<StatCard
				label="목표 달성 시점"
				value={targetYear > 0 ? `${targetYear}년 후${currentAge > 0 ? ` (${currentAge + targetYear}세)` : ''}` : `${simYears}년 내 미달성`}
				sub={targetYear > 0 ? `목표 자산 ${fmt(targetAssets)} 원` : `목표: ${fmt(targetAssets)} 원`}
				variant={targetYear > 0 ? 'green' : 'warn'}
			/>
			<StatCard
				label={`${simYears}년 후 총 자산`}
				value={`${fmt(Math.round(lastYear.total))} 원`}
				sub={`실질 가치 ${fmt(Math.round(lastYear.realValue))} 원`}
				variant="gold"
			/>
			<StatCard
				label="인출률 (목표 자산 기준)"
				value={`${safeWithdrawalRate.toFixed(1)}%`}
				sub={safeWithdrawalRate <= 4 ? '안전 범위 (≤4%)' : '⚠ 4% 초과 — 자산 고갈 위험'}
				variant={safeWithdrawalRate <= 4 ? 'green' : 'warn'}
			/>
		</div>
	)
}
