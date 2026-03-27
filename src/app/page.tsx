import HeroSection from "@/components/home/HeroSection";
import SearchBar from "@/components/home/SearchBar";
import Slider from "@/components/home/Slider";
import PropertyTypeSection from "@/components/home/propertyTypesSection/PropertyTypeSection";
import RieltorSection from "@/components/home/RieltorSection";
import React from "react";
import AdSellBuySection from "@/components/home/AdSellBuySection";

export default function HomePage() {


	return (
		<main className="bg-white -mt-24">
			<HeroSection/>
			<SearchBar/>
			<Slider/>
			<PropertyTypeSection/>
			<RieltorSection/>
			<AdSellBuySection/>

		</main>
	);
}
