'use client'

import { useState } from 'react'
import type { YearlyResult } from '@/types/simulation'
import { fmtFull } from '@/lib/formatters'
import { generateTableImage } from '@/lib/imageExport'

interface ResultsTableProps {
	years: YearlyResult[]
	targetYear: number
}

export default function ResultsTable({ years, targetYear }: ResultsTableProps) {
	const [exporting, setExporting] = useState(false)

	const handleExport = async () => {
		if (exporting) return
		setExporting(true)
		try {
			const blob = await generateTableImage(years, targetYear)
			const url = URL.createObjectURL(blob)
			const a = document.createElement('a')
			a.href = url
			a.download = 'fi-simulation-table.png'
			a.click()
			URL.revokeObjectURL(url)
		} catch (e) {
			console.error('Table image export failed:', e)
		} finally {
			setExporting(false)
		}
	}

	return (
		<div className="bg-bg-card border border-border-default rounded-[14px] overflow-hidden mb-8">
			<div className="px-6 py-[18px] text-[15px] font-semibold text-text-secondary border-b border-border-default flex justify-between items-center">
				<span>연도별 상세 내역</span>
				<div className="flex items-center gap-3">
					<button
						onClick={handleExport}
						disabled={exporting}
						className="py-1.5 px-3 rounded-lg text-xs font-medium cursor-pointer transition-all duration-200 flex items-center gap-1.5 bg-bg-secondary text-text-secondary border border-border-default hover:bg-bg-card-hover hover:text-text-primary disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<svg
							width="14"
							height="14"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							viewBox="0 0 24 24"
						>
							<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
							<polyline points="7 10 12 15 17 10" />
							<line x1="12" y1="15" x2="12" y2="3" />
						</svg>
						{exporting ? '생성 중...' : '이미지 저장'}
					</button>
					<span className="text-xs font-normal text-text-muted">단위: 만원</span>
				</div>
			</div>
			<div className="table-scroll max-h-[420px] overflow-y-auto">
				<table className="w-full border-collapse text-[13px]">
					<thead className="sticky top-0 z-[2]">
						<tr>
							<th className="py-3 px-4 text-center font-semibold text-[11px] tracking-[0.5px] uppercase text-text-muted bg-bg-secondary border-b border-border-default">
								연차
							</th>
							<th className="py-3 px-4 text-right font-semibold text-[11px] tracking-[0.5px] uppercase text-text-muted bg-bg-secondary border-b border-border-default">
								시작 자산
							</th>
							<th className="py-3 px-4 text-right font-semibold text-[11px] tracking-[0.5px] uppercase text-text-muted bg-bg-secondary border-b border-border-default">
								저축/지출
							</th>
							<th className="py-3 px-4 text-right font-semibold text-[11px] tracking-[0.5px] uppercase text-text-muted bg-bg-secondary border-b border-border-default">
								투자 수익
							</th>
							<th className="py-3 px-4 text-right font-semibold text-[11px] tracking-[0.5px] uppercase text-text-muted bg-bg-secondary border-b border-border-default">
								총 자산
							</th>
							<th className="py-3 px-4 text-right font-semibold text-[11px] tracking-[0.5px] uppercase text-text-muted bg-bg-secondary border-b border-border-default">
								실질 가치
							</th>
						</tr>
					</thead>
					<tbody>
						{years.map((r) => (
							<tr
								key={r.year}
								className={
									r.year === targetYear
										? '[&>td]:bg-accent-glow [&>td]:text-accent [&>td]:font-semibold'
										: 'hover:[&>td]:bg-[rgba(74,143,166,0.04)] hover:[&>td]:text-text-primary'
								}
							>
								<td className="py-[11px] px-4 text-center font-mono text-[12.5px] font-semibold text-text-primary border-b border-[rgba(12,12,9,0.06)]">
									{r.year}
								</td>
								<td className="py-[11px] px-4 text-right font-mono text-[12.5px] text-text-primary border-b border-[rgba(12,12,9,0.06)]">
									{fmtFull(r.start)}
								</td>
								<td
									className={`py-[11px] px-4 text-right font-mono text-[12.5px] border-b border-[rgba(12,12,9,0.06)] ${r.savings < 0 ? 'text-danger' : 'text-text-primary'}`}
								>
									{fmtFull(r.savings)}
								</td>
								<td
									className={`py-[11px] px-4 text-right font-mono text-[12.5px] border-b border-[rgba(12,12,9,0.06)] ${r.investReturn < 0 ? 'text-danger' : 'text-text-primary'}`}
								>
									{fmtFull(r.investReturn)}
								</td>
								<td className="py-[11px] px-4 text-right font-mono text-[12.5px] text-text-primary border-b border-[rgba(12,12,9,0.06)]">
									{fmtFull(r.total)}
								</td>
								<td className="py-[11px] px-4 text-right font-mono text-[12.5px] text-text-primary border-b border-[rgba(12,12,9,0.06)]">
									{fmtFull(r.realValue)}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	)
}
