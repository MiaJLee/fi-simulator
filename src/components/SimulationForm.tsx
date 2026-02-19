'use client'

import { useRef } from 'react'
import { useSimulation } from '@/hooks/useSimulation'
import { useToast } from '@/hooks/useToast'
import InputSection from './InputSection'
import InputField from './InputField'
import ResultsPanel from './ResultsPanel'
import Toast from './Toast'

export default function SimulationForm() {
	const { inputs, result, updateField, runSimulation, resetAll, hydrated } = useSimulation()
	const { message, visible, showToast } = useToast()
	const resultRef = useRef<HTMLDivElement>(null)

	const handleRun = () => {
		const error = runSimulation()
		if (error) {
			showToast(error)
			return
		}
		setTimeout(() => {
			resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
		}, 100)
	}

	const handleReset = () => {
		resetAll()
		showToast('초기화 완료')
	}

	if (!hydrated) {
		return null
	}

	return (
		<>
			<div className="flex flex-col lg:flex-row gap-8 items-start">
				{/* 왼쪽: 입력 폼 (sticky) */}
				<div className="w-full lg:w-[400px] lg:shrink-0 lg:sticky lg:top-6">
					{/* 자산 및 수익률 */}
					<InputSection title="자산 및 수익률" icon="₩" iconColor="blue">
						<InputField
							label="현재 자산"
							value={inputs.currentAssets}
							onChange={(v) => updateField('currentAssets', v)}
							placeholder="5,000"
							unit="만원"
						/>
						<InputField
							label="현재 나이"
							value={inputs.currentAge}
							onChange={(v) => updateField('currentAge', v)}
							placeholder="30"
							unit="세"
						/>
						<InputField
							label="연간 수익률"
							value={inputs.returnRate}
							onChange={(v) => updateField('returnRate', v)}
							placeholder="7"
							unit="%"
							inputMode="decimal"
						/>
						<InputField
							label="연간 물가상승률"
							value={inputs.inflationRate}
							onChange={(v) => updateField('inflationRate', v)}
							placeholder="3"
							unit="%"
							inputMode="decimal"
						/>
					</InputSection>

					{/* 소득 및 지출 */}
					<InputSection title="소득 및 지출" icon="↕" iconColor="gold">
						<InputField
							label="월 소득 (세후)"
							value={inputs.monthlyIncome}
							onChange={(v) => updateField('monthlyIncome', v)}
							placeholder="500"
							unit="만원"
						/>
						<InputField
							label="월 생활비 지출"
							value={inputs.monthlyExpense}
							onChange={(v) => updateField('monthlyExpense', v)}
							placeholder="250"
							unit="만원"
						/>
						<InputField
							label="연간 소득 증가율"
							value={inputs.incomeGrowth}
							onChange={(v) => updateField('incomeGrowth', v)}
							placeholder="3"
							unit="%"
							inputMode="decimal"
							fullWidth
						/>
					</InputSection>

					{/* 목표 설정 */}
					<InputSection title="목표 설정" icon="◎" iconColor="green">
						<InputField
							label="목표 자산"
							value={inputs.targetAssets}
							onChange={(v) => updateField('targetAssets', v)}
							placeholder="100,000"
							unit="만원"
						/>
						<InputField
							label="목표 달성 후 월 생활비"
							value={inputs.fiExpense}
							onChange={(v) => updateField('fiExpense', v)}
							placeholder="300"
							unit="만원"
						/>
						<InputField
							label="시뮬레이션 기간"
							value={inputs.simYears}
							onChange={(v) => updateField('simYears', v)}
							placeholder="40"
							unit="년"
							fullWidth
						/>
					</InputSection>

					{/* 자산 하락기 시뮬레이션 */}
					<div className="mb-7">
						<div className="text-[13px] font-semibold tracking-[1.5px] uppercase text-text-muted mb-3.5 pl-0.5">
							<span className="inline-flex items-center justify-center w-5 h-5 rounded-[5px] text-[11px] mr-2 align-middle border bg-danger-bg text-danger border-danger/20">
								↓
							</span>
							자산 하락기 시뮬레이션
						</div>
						<div className="bg-bg-card border border-border-default rounded-[14px] p-6 transition-colors duration-200 hover:border-accent/20">
							<label className="flex items-center gap-3 cursor-pointer select-none">
								<button
									type="button"
									role="switch"
									aria-checked={inputs.crashEnabled}
									onClick={() => updateField('crashEnabled', !inputs.crashEnabled)}
									className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0 ${
										inputs.crashEnabled ? 'bg-danger' : 'bg-bg-secondary'
									}`}
								>
									<span
										className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-200 shadow-sm ${
											inputs.crashEnabled ? 'translate-x-5' : 'translate-x-0'
										}`}
									/>
								</button>
								<span className="text-[13px] font-medium text-text-secondary">
									주기적 자산 하락 적용
								</span>
							</label>
							{inputs.crashEnabled && (
								<div className="grid grid-cols-2 gap-4 mt-4">
									<InputField
										label="하락 주기"
										value={inputs.crashFrequency}
										onChange={(v) => updateField('crashFrequency', v)}
										placeholder="7"
										unit="년마다"
									/>
									<InputField
										label="하락률"
										value={inputs.crashPercent}
										onChange={(v) => updateField('crashPercent', v)}
										placeholder="30"
										unit="%"
										inputMode="decimal"
									/>
								</div>
							)}
						</div>
					</div>

					{/* Buttons */}
					<div className="mb-7 lg:mb-0">
						<div className="flex gap-3 mt-2 flex-wrap">
							<button
								onClick={handleRun}
								className="flex-1 py-[13px] px-6 border-none rounded-[10px] text-sm font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-2 bg-gradient-to-br from-[#474739] to-[#2b2b22] text-white shadow-[0_4px_16px_rgba(12,12,9,0.15)] hover:-translate-y-px hover:shadow-[0_6px_24px_rgba(12,12,9,0.2)]"
							>
								<svg
									width="16"
									height="16"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									viewBox="0 0 24 24"
								>
									<polygon points="5 3 19 12 5 21 5 3" />
								</svg>
								시뮬레이션 실행
							</button>
							<button
								onClick={handleReset}
								className="py-[13px] px-6 rounded-[10px] text-sm font-semibold cursor-pointer transition-all duration-200 flex items-center gap-2 bg-bg-card text-text-secondary border border-border-default hover:bg-bg-card-hover hover:text-text-primary"
							>
								초기화
							</button>
						</div>
					</div>
				</div>

				{/* 오른쪽: 결과 */}
				<div className="w-full lg:flex-1 min-w-0" ref={resultRef}>
					{result && <ResultsPanel result={result} />}
				</div>
			</div>

			<Toast message={message} visible={visible} />
		</>
	)
}
