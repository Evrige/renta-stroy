import React from 'react';
import {Container} from "@/components/layout/Container";
import Link from "next/link";
import {ROUTES} from "@/lib/constants/routes";

const AdSellBuySection = () => {
	return (
		<section
			className="relative w-full aspect-1920/589 bg-cover bg-center"
			style={{backgroundImage: "url('/images/ad.png')"}}
		>
			<div className="absolute inset-0 bg-black/25"/>

			<Container className="relative h-full">
				<div className="flex h-full flex-col items-center justify-center text-center">
					<span className="text-white/80">Купівля та продаж нерухомості</span>
					<h2 className="my-5 max-w-3xl text-3xl font-semibold text-white">
						Розміщуйте оголошення або знаходьте нерухомість швидко та зручно
					</h2>
					<div className="flex flex-wrap justify-center gap-4">
						<button className="rounded-xl bg-primary px-8 py-4 text-white cursor-pointer">
							Розмістити оголошення
						</button>
						<Link
							href={ROUTES.PROPERTIES}
							className="rounded-xl bg-white px-8 py-4 text-primary cursor-pointer"
						>
							Знайти оголошення
						</Link>
					</div>
				</div>
			</Container>
		</section>
	);
};

export default AdSellBuySection;
