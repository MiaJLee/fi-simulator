export default function Header() {
  return (
    <header className="pt-12 pb-8 text-center">
      <div className="inline-block font-mono text-[11px] font-medium tracking-[2px] uppercase text-gold bg-gold-glow border border-gold/20 px-4 py-1.5 rounded-full mb-5">
        Financial Independence Simulator
      </div>
      <h1 className="text-[26px] sm:text-4xl font-bold -tracking-[1px] bg-gradient-to-br from-text-primary to-text-secondary bg-clip-text text-transparent mb-2.5">
        경제적 자유 시뮬레이터
      </h1>
      <p className="text-text-secondary text-[15px] font-light">
        자산 성장을 시뮬레이션하고 경제적 자유까지 걸리는 시간을 계산합니다
      </p>
    </header>
  );
}
