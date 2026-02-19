import Header from '@/components/Header'
import Footer from '@/components/Footer'
import SimulationForm from '@/components/SimulationForm'

export default function Home() {
	return (
		<div className=" main-content max-w-[1200px] mx-auto px-8 py-6 relative z-[1] flex-1 flex flex-col">
			<Header />
			<SimulationForm />
			<Footer />
		</div>
	)
}
