'use client'

import { useRef, useEffect, useCallback, useState } from 'react'
import type { YearlyResult } from '@/types/simulation'
import { fmtFull } from '@/lib/formatters'
import { CHART_COLORS } from '@/lib/constants'
import { renderChart } from '@/lib/chartRenderer'

interface AssetChartProps {
	years: YearlyResult[]
	targetYear: number
	targetAssets: number
	currentAge: number
}

interface ChartLayout {
	W: number
	H: number
	pad: { top: number; right: number; bottom: number; left: number }
	xStep: number
	x: (i: number) => number
	y: (v: number) => number
}

interface HoverData {
	index: number
	yearData: YearlyResult
	linePctX: number
	totalDotPctX: number
	totalDotPctY: number
	realDotPctX: number
	realDotPctY: number
	pxX: number
	pxTotalY: number
}

export default function AssetChart({ years, targetYear, targetAssets, currentAge }: AssetChartProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const layoutRef = useRef<ChartLayout | null>(null)
	const [hover, setHover] = useState<HoverData | null>(null)

	const drawChart = useCallback(() => {
		const canvas = canvasRef.current
		const container = containerRef.current
		if (!canvas || !container || years.length === 0) return

		const ctx = canvas.getContext('2d')
		if (!ctx) return

		const dpr = window.devicePixelRatio || 1
		const W = container.clientWidth
		const H = 320

		canvas.width = W * dpr
		canvas.height = H * dpr
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
		ctx.clearRect(0, 0, W, H)

		const result = renderChart(ctx, years, targetYear, targetAssets, currentAge, W, H)
		if (result) {
			layoutRef.current = { W, H, ...result }
		}
	}, [years, targetYear, targetAssets, currentAge])

	const handleMouseMove = useCallback(
		(e: React.MouseEvent<HTMLDivElement>) => {
			const container = containerRef.current
			const layout = layoutRef.current
			if (!container || !layout || years.length === 0) return

			const rect = container.getBoundingClientRect()
			const mouseX = e.clientX - rect.left
			const { W, H, pad, xStep, x, y } = layout

			const chartX = (mouseX / rect.width) * W
			const index = Math.round((chartX - pad.left) / xStep)
			const clampedIndex = Math.max(0, Math.min(index, years.length - 1))
			const yr = years[clampedIndex]

			const cx = x(clampedIndex)
			setHover({
				index: clampedIndex,
				yearData: yr,
				linePctX: (cx / W) * 100,
				totalDotPctX: (cx / W) * 100,
				totalDotPctY: (y(yr.total) / H) * 100,
				realDotPctX: (cx / W) * 100,
				realDotPctY: (y(yr.realValue) / H) * 100,
				pxX: mouseX,
				pxTotalY: (y(yr.total) / H) * rect.height,
			})
		},
		[years],
	)

	const handleMouseLeave = useCallback(() => {
		setHover(null)
	}, [])

	useEffect(() => {
		drawChart()
		setHover(null)

		const container = containerRef.current
		if (!container) return

		const observer = new ResizeObserver(() => {
			drawChart()
			setHover(null)
		})
		observer.observe(container)

		return () => observer.disconnect()
	}, [drawChart])

	const layout = layoutRef.current

	return (
		<div className="bg-bg-card border border-border-default rounded-[14px] p-7 mb-6">
			<h3 className="text-[15px] font-semibold mb-5 text-text-secondary">자산 성장 추이</h3>
			<div
				ref={containerRef}
				className="relative cursor-crosshair"
				onMouseMove={handleMouseMove}
				onMouseLeave={handleMouseLeave}
			>
				<canvas
					ref={canvasRef}
					className="block w-full"
					style={{ height: '320px' }}
				/>

				{hover && layout && (
					<>
						<div
							className="absolute pointer-events-none"
							style={{
								left: `${hover.linePctX}%`,
								top: `${(layout.pad.top / layout.H) * 100}%`,
								bottom: `${(layout.pad.top / layout.H) * 100}%`,
								width: 0,
								borderLeft: '1px dashed rgba(12,12,9,0.15)',
							}}
						/>

						<div
							className="absolute pointer-events-none w-[10px] h-[10px] rounded-full border-2 border-white"
							style={{
								left: `${hover.totalDotPctX}%`,
								top: `${hover.totalDotPctY}%`,
								transform: 'translate(-50%, -50%)',
								backgroundColor: CHART_COLORS.totalLine,
							}}
						/>

						<div
							className="absolute pointer-events-none w-2 h-2 rounded-full border-2 border-white"
							style={{
								left: `${hover.realDotPctX}%`,
								top: `${hover.realDotPctY}%`,
								transform: 'translate(-50%, -50%)',
								backgroundColor: CHART_COLORS.legendGold,
							}}
						/>

						<div
							className="absolute pointer-events-none z-10 bg-bg-secondary/95 border border-border-default rounded-lg px-4 py-3 shadow-lg backdrop-blur-sm whitespace-nowrap"
							style={{
								left: `${hover.linePctX}%`,
								top: `${hover.totalDotPctY}%`,
								transform: `translate(${hover.linePctX > 65 ? 'calc(-100% - 14px)' : '14px'}, -50%)`,
							}}
						>
							<div className="text-[11px] font-semibold text-accent mb-1.5">
								{currentAge > 0 ? `${currentAge + hover.yearData.year}세` : `${hover.yearData.year}년차`}
							</div>
							<div className="flex flex-col gap-1 text-[11px]">
								<div className="flex items-center gap-2">
									<span className="w-2 h-2 rounded-full bg-[#4a8fa6] shrink-0" />
									<span className="text-text-muted w-14">총 자산</span>
									<span className="font-mono font-medium text-text-primary">
										{fmtFull(hover.yearData.total)} 만원
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="w-2 h-2 rounded-full bg-[#4d7a42] shrink-0" />
									<span className="text-text-muted w-14">투자수익</span>
									<span className="font-mono font-medium text-text-primary">
										{fmtFull(hover.yearData.investReturn)} 만원
									</span>
								</div>
								<div className="flex items-center gap-2">
									<span className="w-2 h-2 rounded-full bg-[#a67040] shrink-0" />
									<span className="text-text-muted w-14">실질가치</span>
									<span className="font-mono font-medium text-text-primary">
										{fmtFull(hover.yearData.realValue)} 만원
									</span>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</div>
	)
}
