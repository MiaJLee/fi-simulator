import type { SimulationResult, YearlyResult } from '@/types/simulation'
import { fmt, fmtFull } from './formatters'
import { renderChart } from './chartRenderer'

const W = 390
const H = 844
const DPR = 2
const PAD = 24

const COLORS = {
  bg: '#f4f4f0',
  card: '#ffffff',
  cardBorder: 'rgba(12,12,9,0.1)',
  textPrimary: '#0c0c09',
  textSecondary: '#5b5b4b',
  textMuted: '#7c7c67',
  accent: '#4a8fa6',
  gold: '#a67040',
  success: '#4d7a42',
  warning: '#b8860b',
  danger: '#a65d50',
}

const VARIANT_ACCENT: Record<string, string> = {
  accent: COLORS.accent,
  gold: COLORS.gold,
  green: COLORS.success,
  warn: COLORS.warning,
}

interface CardData {
  label: string
  value: string
  sub: string
  variant: string
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number, y: number, w: number, h: number, r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

function getStatCards(result: SimulationResult): CardData[] {
  const { years, targetYear, currentAge, monthlySavings, savingsRate, safeWithdrawalRate, targetAssets, simYears } = result
  const lastYear = years[years.length - 1]

  return [
    {
      label: '월 저축액',
      value: `${fmt(monthlySavings)} 만원`,
      sub: `저축률 ${savingsRate.toFixed(1)}%`,
      variant: 'accent',
    },
    {
      label: '목표 달성 시점',
      value: targetYear > 0
        ? `${targetYear}년 후${currentAge > 0 ? ` (${currentAge + targetYear}세)` : ''}`
        : `${simYears}년 내 미달성`,
      sub: targetYear > 0 ? `목표 자산 ${fmt(targetAssets)} 원` : `목표: ${fmt(targetAssets)} 원`,
      variant: targetYear > 0 ? 'green' : 'warn',
    },
    {
      label: `${simYears}년 후 총 자산`,
      value: `${fmt(Math.round(lastYear.total))} 원`,
      sub: `실질 가치 ${fmt(Math.round(lastYear.realValue))} 원`,
      variant: 'gold',
    },
    {
      label: '인출률 (목표 자산 기준)',
      value: `${safeWithdrawalRate.toFixed(1)}%`,
      sub: safeWithdrawalRate <= 4 ? '안전 범위 (≤4%)' : '4% 초과 — 자산 고갈 위험',
      variant: safeWithdrawalRate <= 4 ? 'green' : 'warn',
    },
  ]
}

function drawBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, W, H)

  // Subtle radial gradients
  const g1 = ctx.createRadialGradient(W * 0.3, H * 0.2, 0, W * 0.3, H * 0.2, W * 0.6)
  g1.addColorStop(0, 'rgba(74,143,166,0.05)')
  g1.addColorStop(1, 'transparent')
  ctx.fillStyle = g1
  ctx.fillRect(0, 0, W, H)

  const g2 = ctx.createRadialGradient(W * 0.7, H * 0.8, 0, W * 0.7, H * 0.8, W * 0.5)
  g2.addColorStop(0, 'rgba(166,112,64,0.04)')
  g2.addColorStop(1, 'transparent')
  ctx.fillStyle = g2
  ctx.fillRect(0, 0, W, H)
}

function drawHeader(ctx: CanvasRenderingContext2D): number {
  let y = 40

  // Tag badge
  ctx.font = '500 9px JetBrains Mono, monospace'
  const tagText = 'FINANCIAL INDEPENDENCE SIMULATOR'
  const tagWidth = ctx.measureText(tagText).width + 20
  const tagX = (W - tagWidth) / 2

  roundRect(ctx, tagX, y, tagWidth, 22, 11)
  ctx.fillStyle = 'rgba(166,112,64,0.1)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(166,112,64,0.2)'
  ctx.lineWidth = 0.5
  ctx.stroke()

  ctx.fillStyle = COLORS.gold
  ctx.textAlign = 'center'
  ctx.fillText(tagText, W / 2, y + 15)

  y += 36

  // Title
  ctx.font = '700 22px Noto Sans KR, sans-serif'
  ctx.fillStyle = COLORS.textPrimary
  ctx.textAlign = 'center'
  ctx.fillText('경제적 자유 시뮬레이터', W / 2, y + 22)

  return y + 46
}

function drawStatCard(
  ctx: CanvasRenderingContext2D,
  card: CardData,
  cx: number,
  cy: number,
  cw: number,
  ch: number,
) {
  // Card background
  roundRect(ctx, cx, cy, cw, ch, 10)
  ctx.fillStyle = COLORS.card
  ctx.fill()
  ctx.strokeStyle = COLORS.cardBorder
  ctx.lineWidth = 0.5
  ctx.stroke()

  // Top accent bar
  const accentColor = VARIANT_ACCENT[card.variant] || COLORS.accent
  ctx.save()
  roundRect(ctx, cx, cy, cw, ch, 10)
  ctx.clip()
  ctx.fillStyle = accentColor
  ctx.fillRect(cx, cy, cw, 2.5)
  ctx.restore()

  // Label
  ctx.font = '500 10px Noto Sans KR, sans-serif'
  ctx.fillStyle = COLORS.textMuted
  ctx.textAlign = 'left'
  ctx.fillText(card.label, cx + 14, cy + 22)

  // Value
  ctx.font = '600 16px JetBrains Mono, monospace'
  ctx.fillStyle = COLORS.textPrimary
  ctx.fillText(card.value, cx + 14, cy + 46)

  // Sub
  ctx.font = '400 10px Noto Sans KR, sans-serif'
  ctx.fillStyle = COLORS.textSecondary
  ctx.fillText(card.sub, cx + 14, cy + 64)
}

function drawStatCards(ctx: CanvasRenderingContext2D, result: SimulationResult, startY: number): number {
  const cards = getStatCards(result)
  const gap = 10
  const cardW = (W - PAD * 2 - gap) / 2
  const cardH = 78

  for (let i = 0; i < cards.length; i++) {
    const col = i % 2
    const row = Math.floor(i / 2)
    const cx = PAD + col * (cardW + gap)
    const cy = startY + row * (cardH + gap)
    drawStatCard(ctx, cards[i], cx, cy, cardW, cardH)
  }

  return startY + 2 * cardH + gap + 20
}

function drawCrashBadge(ctx: CanvasRenderingContext2D, result: SimulationResult, startY: number): number {
  if (!result.crashEnabled) return startY

  const badgeH = 28
  const badgeW = W - PAD * 2
  const text = `${result.crashFrequency}년마다 ${result.crashPercent}% 자산 하락 적용`

  roundRect(ctx, PAD, startY, badgeW, badgeH, 8)
  ctx.fillStyle = 'rgba(166,93,80,0.06)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(166,93,80,0.2)'
  ctx.lineWidth = 0.5
  ctx.stroke()

  ctx.font = '500 11px Noto Sans KR, sans-serif'
  ctx.fillStyle = COLORS.danger
  ctx.textAlign = 'center'
  ctx.fillText(`↓ ${text}`, W / 2, startY + 18)

  return startY + badgeH + 12
}

function drawChartSection(ctx: CanvasRenderingContext2D, result: SimulationResult, startY: number): number {
  const chartH = 280
  const chartW = W - PAD * 2

  // Section title
  ctx.font = '600 13px Noto Sans KR, sans-serif'
  ctx.fillStyle = COLORS.textSecondary
  ctx.textAlign = 'left'
  ctx.fillText('자산 성장 추이', PAD, startY + 14)

  const chartY = startY + 28

  // Chart card background
  roundRect(ctx, PAD, chartY, chartW, chartH, 10)
  ctx.fillStyle = COLORS.card
  ctx.fill()
  ctx.strokeStyle = COLORS.cardBorder
  ctx.lineWidth = 0.5
  ctx.stroke()

  // Clip and draw chart inside the card
  ctx.save()
  roundRect(ctx, PAD, chartY, chartW, chartH, 10)
  ctx.clip()

  ctx.translate(PAD, chartY)
  renderChart(ctx, result.years, result.targetYear, result.targetAssets, result.currentAge, chartW, chartH)
  ctx.translate(-PAD, -chartY)

  ctx.restore()

  return chartY + chartH + 20
}

function drawFooter(ctx: CanvasRenderingContext2D) {
  const y = H - 30
  ctx.font = '400 10px JetBrains Mono, monospace'
  ctx.fillStyle = COLORS.textMuted
  ctx.textAlign = 'center'
  ctx.fillText(`fi-simulator • ${new Date().getFullYear()}`, W / 2, y)
}

const TABLE_COLS = [
  { label: '연차', width: 42, align: 'center' as CanvasTextAlign },
  { label: '시작 자산', width: 72, align: 'right' as CanvasTextAlign },
  { label: '저축/지출', width: 68, align: 'right' as CanvasTextAlign },
  { label: '투자 수익', width: 68, align: 'right' as CanvasTextAlign },
  { label: '총 자산', width: 72, align: 'right' as CanvasTextAlign },
  { label: '실질 가치', width: 72, align: 'right' as CanvasTextAlign },
]

export async function generateTableImage(
  years: YearlyResult[],
  targetYear: number,
): Promise<Blob> {
  await document.fonts.ready

  const tableW = W
  const headerH = 52
  const thH = 30
  const rowH = 28
  const footerH = 36
  const tableH = headerH + thH + rowH * years.length + footerH

  const canvas = document.createElement('canvas')
  canvas.width = tableW * DPR
  canvas.height = tableH * DPR
  const ctx = canvas.getContext('2d')!
  ctx.scale(DPR, DPR)

  // Background
  ctx.fillStyle = COLORS.bg
  ctx.fillRect(0, 0, tableW, tableH)

  // Header
  ctx.font = '600 15px Noto Sans KR, sans-serif'
  ctx.fillStyle = COLORS.textSecondary
  ctx.textAlign = 'left'
  ctx.fillText('연도별 상세 내역', PAD, 32)

  ctx.font = '400 10px Noto Sans KR, sans-serif'
  ctx.fillStyle = COLORS.textMuted
  ctx.textAlign = 'right'
  ctx.fillText('단위: 만원', tableW - PAD, 32)

  // Table header row
  const tableTop = headerH
  ctx.fillStyle = '#e8e8e3'
  ctx.fillRect(PAD, tableTop, tableW - PAD * 2, thH)

  ctx.font = '600 9px Noto Sans KR, sans-serif'
  ctx.fillStyle = COLORS.textMuted
  let colX = PAD
  for (const col of TABLE_COLS) {
    ctx.textAlign = col.align
    const tx = col.align === 'center' ? colX + col.width / 2
      : col.align === 'right' ? colX + col.width - 6
      : colX + 6
    ctx.fillText(col.label, tx, tableTop + 19)
    colX += col.width
  }

  // Divider under header
  ctx.strokeStyle = COLORS.cardBorder
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(PAD, tableTop + thH)
  ctx.lineTo(tableW - PAD, tableTop + thH)
  ctx.stroke()

  // Table rows
  const bodyTop = tableTop + thH
  ctx.font = '500 10px JetBrains Mono, monospace'

  for (let i = 0; i < years.length; i++) {
    const r = years[i]
    const ry = bodyTop + i * rowH
    const isTarget = r.year === targetYear

    // Alternating row background
    if (i % 2 === 1) {
      ctx.fillStyle = 'rgba(12,12,9,0.02)'
      ctx.fillRect(PAD, ry, tableW - PAD * 2, rowH)
    }

    // Target year highlight
    if (isTarget) {
      ctx.fillStyle = 'rgba(74,143,166,0.12)'
      ctx.fillRect(PAD, ry, tableW - PAD * 2, rowH)
    }

    const values = [
      String(r.year),
      fmtFull(r.start),
      fmtFull(r.savings),
      fmtFull(r.investReturn),
      fmtFull(r.total),
      fmtFull(r.realValue),
    ]

    colX = PAD
    for (let c = 0; c < TABLE_COLS.length; c++) {
      const col = TABLE_COLS[c]
      ctx.textAlign = col.align

      // Color: target row accent, negative savings red, default black
      if (isTarget) {
        ctx.fillStyle = COLORS.accent
      } else if (c === 2 && r.savings < 0) {
        ctx.fillStyle = COLORS.danger
      } else if (c === 3 && r.investReturn < 0) {
        ctx.fillStyle = COLORS.danger
      } else {
        ctx.fillStyle = COLORS.textPrimary
      }

      const tx = col.align === 'center' ? colX + col.width / 2
        : col.align === 'right' ? colX + col.width - 6
        : colX + 6
      ctx.fillText(values[c], tx, ry + 18)
      colX += col.width
    }

    // Row divider
    ctx.strokeStyle = 'rgba(12,12,9,0.06)'
    ctx.lineWidth = 0.5
    ctx.beginPath()
    ctx.moveTo(PAD, ry + rowH)
    ctx.lineTo(tableW - PAD, ry + rowH)
    ctx.stroke()
  }

  // Footer
  ctx.font = '400 10px JetBrains Mono, monospace'
  ctx.fillStyle = COLORS.textMuted
  ctx.textAlign = 'center'
  ctx.fillText(`fi-simulator • ${new Date().getFullYear()}`, tableW / 2, tableH - 14)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Failed to create table image'))
    }, 'image/png')
  })
}

export async function generateResultImage(result: SimulationResult): Promise<Blob> {
  await document.fonts.ready

  const canvas = document.createElement('canvas')
  canvas.width = W * DPR
  canvas.height = H * DPR
  const ctx = canvas.getContext('2d')!
  ctx.scale(DPR, DPR)

  drawBackground(ctx)
  const afterHeader = drawHeader(ctx)
  const afterCards = drawStatCards(ctx, result, afterHeader)
  const afterBadge = drawCrashBadge(ctx, result, afterCards)
  drawChartSection(ctx, result, afterBadge)
  drawFooter(ctx)

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob)
      else reject(new Error('Failed to create image'))
    }, 'image/png')
  })
}
