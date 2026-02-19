export function fmt(n: number): string {
	const abs = Math.abs(n)
	if (abs >= 10000) {
		const sign = n < 0 ? '-' : ''
		const val = (abs / 10000).toFixed(1).replace(/\.0$/, '')
		return `${sign}${val}억`
	}
	return n.toLocaleString('ko-KR')
}

export function fmtFull(n: number): string {
	return Math.round(n).toLocaleString('ko-KR')
}

export function parseNum(value: string): number {
	return parseFloat(value?.replace(/,/g, '')) || 0
}
