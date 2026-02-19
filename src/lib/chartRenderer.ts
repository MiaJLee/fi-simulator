import type { YearlyResult } from '@/types/simulation'
import { fmt } from './formatters'
import { CHART_COLORS } from './constants'

export function renderChart(
  ctx: CanvasRenderingContext2D,
  years: YearlyResult[],
  targetYear: number,
  targetAssets: number,
  currentAge: number,
  W: number,
  H: number,
) {
  if (years.length === 0) return

  const pad = { top: 20, right: 20, bottom: 40, left: 70 }
  const cw = W - pad.left - pad.right
  const ch = H - pad.top - pad.bottom
  const maxVal = Math.max(...years.map((y) => y.total), targetAssets) * 1.1
  const xStep = cw / (years.length - 1 || 1)
  const x = (i: number) => pad.left + i * xStep
  const y = (v: number) => pad.top + ch - (v / maxVal) * ch

  // Grid
  ctx.strokeStyle = CHART_COLORS.grid
  ctx.lineWidth = 0.5
  const gridLines = 5
  for (let i = 0; i <= gridLines; i++) {
    const gy = pad.top + (ch / gridLines) * i
    ctx.beginPath()
    ctx.moveTo(pad.left, gy)
    ctx.lineTo(W - pad.right, gy)
    ctx.stroke()
    const val = maxVal - (maxVal / gridLines) * i
    ctx.fillStyle = CHART_COLORS.label
    ctx.font = '11px JetBrains Mono, monospace'
    ctx.textAlign = 'right'
    ctx.fillText(fmt(Math.round(val)), pad.left - 10, gy + 4)
  }

  // X axis labels
  ctx.fillStyle = CHART_COLORS.label
  ctx.textAlign = 'center'
  const labelStep = Math.max(1, Math.ceil(years.length / 10))
  years.forEach((yr, i) => {
    if (i % labelStep === 0 || i === years.length - 1) {
      const label = currentAge > 0 ? `${currentAge + yr.year}세` : `${yr.year}년`
      ctx.fillText(label, x(i), H - pad.bottom + 20)
    }
  })

  // Target line
  if (targetAssets > 0 && targetAssets < maxVal) {
    ctx.strokeStyle = CHART_COLORS.targetLine
    ctx.lineWidth = 1
    ctx.setLineDash([6, 4])
    ctx.beginPath()
    ctx.moveTo(pad.left, y(targetAssets))
    ctx.lineTo(W - pad.right, y(targetAssets))
    ctx.stroke()
    ctx.setLineDash([])
    ctx.fillStyle = CHART_COLORS.targetText
    ctx.font = '11px JetBrains Mono, monospace'
    ctx.textAlign = 'left'
    ctx.fillText('목표 ' + fmt(targetAssets), W - pad.right - 80, y(targetAssets) - 6)
  }

  // Real value area
  ctx.beginPath()
  ctx.moveTo(x(0), y(years[0].realValue))
  years.forEach((yr, i) => ctx.lineTo(x(i), y(yr.realValue)))
  ctx.lineTo(x(years.length - 1), y(0))
  ctx.lineTo(x(0), y(0))
  ctx.closePath()
  ctx.fillStyle = CHART_COLORS.realValueArea
  ctx.fill()

  // Real value line
  ctx.beginPath()
  ctx.moveTo(x(0), y(years[0].realValue))
  years.forEach((yr, i) => ctx.lineTo(x(i), y(yr.realValue)))
  ctx.strokeStyle = CHART_COLORS.realValueLine
  ctx.lineWidth = 2
  ctx.stroke()

  // Total asset area
  ctx.beginPath()
  ctx.moveTo(x(0), y(years[0].total))
  years.forEach((yr, i) => ctx.lineTo(x(i), y(yr.total)))
  ctx.lineTo(x(years.length - 1), y(0))
  ctx.lineTo(x(0), y(0))
  ctx.closePath()
  const grad = ctx.createLinearGradient(0, pad.top, 0, H - pad.bottom)
  grad.addColorStop(0, CHART_COLORS.totalAreaTop)
  grad.addColorStop(1, CHART_COLORS.totalAreaBottom)
  ctx.fillStyle = grad
  ctx.fill()

  // Total asset line
  ctx.beginPath()
  ctx.moveTo(x(0), y(years[0].total))
  years.forEach((yr, i) => ctx.lineTo(x(i), y(yr.total)))
  ctx.strokeStyle = CHART_COLORS.totalLine
  ctx.lineWidth = 2.5
  ctx.stroke()

  // Target year dot
  if (targetYear > 0) {
    const ti = targetYear - 1
    ctx.beginPath()
    ctx.arc(x(ti), y(years[ti].total), 5, 0, Math.PI * 2)
    ctx.fillStyle = CHART_COLORS.targetDot
    ctx.fill()
    ctx.strokeStyle = CHART_COLORS.dotStroke
    ctx.lineWidth = 2
    ctx.stroke()
  }

  // Legend
  ctx.font = '11px Noto Sans KR, sans-serif'
  ctx.textAlign = 'left'
  const ly = H - 8
  ctx.fillStyle = CHART_COLORS.legendBlue
  ctx.fillRect(pad.left, ly - 6, 14, 3)
  ctx.fillStyle = CHART_COLORS.legendText
  ctx.fillText('명목 자산', pad.left + 20, ly)
  ctx.fillStyle = CHART_COLORS.legendGold
  ctx.fillRect(pad.left + 90, ly - 6, 14, 3)
  ctx.fillStyle = CHART_COLORS.legendText
  ctx.fillText('실질 가치', pad.left + 110, ly)

  return { pad, maxVal, xStep, x, y, cw, ch }
}
