import React from "react";
import { Container } from "@/components/layout/Container";
import { prisma } from "@/lib/prisma";
import PropertyTypeItem from "@/components/home/propertyTypesSection/PropertyTypeItem";
import { formatCount } from "@/app/utils/formatCount";

const propertyTypeCards = [
	{
		type: "HOUSE",
		title: "Будинки",
		imageUrl: "/images/propertyTypes/type1.png",
		className: "col-span-12 md:col-span-6",
	},
	{
		type: "APARTMENT",
		title: "Квартири",
		imageUrl: "/images/propertyTypes/type2.png",
		className: "col-span-12 sm:col-span-6 md:col-span-3",
	},
	{
		type: "OFFICE",
		title: "Офіси",
		imageUrl: "/images/propertyTypes/type3.png",
		className: "col-span-12 sm:col-span-6 md:col-span-3",
	},
	{
		type: "WAREHOUSE",
		title: "Склади",
		imageUrl: "/images/propertyTypes/type4.png",
		className: "col-span-12 sm:col-span-6 md:col-span-3",
	},
	{
		type: "COMMERCIAL",
		title: "Комерційні",
		imageUrl: "/images/propertyTypes/type5.png",
		className: "col-span-12 sm:col-span-6 md:col-span-3",
	},
	{
		type: "MALL",
		title: "Торгівельні центри",
		imageUrl: "/images/propertyTypes/type6.png",
		className: "col-span-12 md:col-span-6",
	},
] as const;

const PropertyTypeSection = async () => {
	const propertyTypesCount = await prisma.property.groupBy({
		by: ["propertyType"],
		_count: {
			propertyType: true,
		},
	});

	const countsMap = Object.fromEntries(
		propertyTypesCount.map((item) => [item.propertyType, item._count.propertyType])
	) as Record<string, number>;

	return (
		<section className="pt-20 pb-32 w-full bg-bg-secondary">
			<Container>
				<div className="mb-8 text-center">
					<h2 className="text-3xl font-semibold text-primary">
						Оберіть тип приміщення
					</h2>
					<span className="mt-2 block text-secondary">
            Приміщення під будь-яку задачу
          </span>
				</div>

				<div className="grid grid-cols-12 gap-5 auto-rows-[180px]">
					{propertyTypeCards.map((item) => {
						const count = countsMap[item.type] ?? 0;

						return (
							<PropertyTypeItem
								key={item.type}
								imageUrl={item.imageUrl}
								title={item.title}
								count={count}
								countLabel={formatCount(count)}
								className={item.className}
							/>
						);
					})}
				</div>
			</Container>
		</section>
	);
};

export default PropertyTypeSection;