import HeroSection from "@/components/home/HeroSection";
import SearchBar from "@/components/home/SearchBar";
import Slider from "@/components/home/Slider";
import PropertyTypeSection from "@/components/home/propertyTypesSection/PropertyTypeSection";
export default function HomePage() {


	return (
		<main className="bg-white -mt-24">
			<HeroSection />
			<SearchBar />
			<Slider />
			<PropertyTypeSection />
		</main>
	);
}