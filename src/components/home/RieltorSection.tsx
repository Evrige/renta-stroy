import React from 'react';
import {Container} from "@/components/layout/Container";
import RieltorCard from "@/components/home/RieltorCard";

const RieltorSection = () => {
	return (
		<section className="bg-secondary/10 py-20">
			<Container>
				<div className="flex flex-col items-center gap-3 text-center">
					<h2 className="text-3xl font-semibold text-primary">Як рієлтор допоможе вам із нерухомістю</h2>
					<p className="max-w-2xl text-secondary">
						Підібрати житло, підготувати продаж або знайти комфортну оренду без зайвих клопотів.
					</p>
				</div>
				<div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
					<RieltorCard title="Купити нерухомість"
											 description="Підберемо будинок або квартиру за вашим бюджетом, районом і побажаннями."
											 icon="/icons/realtor2.svg" alt="Пошук нерухомості для купівлі" buttonText="Знайти житло"/>
					<RieltorCard title="Продати нерухомість"
											 description="Допоможемо вигідно презентувати об&apos;єкт, знайти покупця та супроводимо угоду."
											 icon="/icons/realtor1.svg" alt="Допомога з продажем нерухомості"
											 buttonText="Розмістити оголошення" buttonVariant="filled"/>
					<RieltorCard title="Орендувати нерухомість"
											 description="Знайдемо варіант для короткострокової або довгострокової оренди під ваш запит."
											 icon="/icons/realtor3.svg" alt="Пошук нерухомості для оренди" buttonText="	Знайти оренду"/>
				</div>
			</Container>
		</section>
	);
};

export default RieltorSection;
