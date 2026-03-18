import React from 'react';
import {prisma} from "@/lib/prisma";
import {Container} from "@/components/layout/Container";
import Image from "next/image";
import {BedDouble, Heart, LandPlot, SquareArrowOutUpRight, SquaresExclude} from "lucide-react";
import {getRoomsLabel} from "@/app/utils/getRoomsLabel";
import {formatListingType, formatRentPeriod} from "@/app/utils/formatters";

const Page = async () => {
	const properties = await prisma.property.findMany({
		select: {
			id: true,
			slug: true,
			title: true,
			price: true,
			listingType: true,
			propertyType: true,
			area: true,
			rooms: true,
			rentPeriod: true,
			location: {
				select: {
					city: true,
					district: true,
				},
			},
			images: {
				where: {
					isMain: true,
				},
				select: {
					url: true,
					alt: true,
				},
				take: 1,
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});
	return (
			<Container className="grid grid-cols-4 gap-4">
				{properties.map((property)=> (
					<div key={property.id} className="rounded-xl rounded-t-lg border border-gray-300">
						<Image
							// src={property.images[0]?.url}
							src="/images/test.png"
							width={200}
							height={200}
							alt={property.title}
							className="mb-3 h-48 w-full rounded-t-lg object-cover"
						/>

						<div className="px-2 pb-4 flex flex-col gap-2">
							<h2 className="text-sm text-primary font-semibold line-clamp-1">{property.title}</h2>
							<p className="text-xs text-secondary">
								{property.location.city}
							</p>
							<div className="flex gap-2 border-b border-gray-200 pb-5">
								<div className="flex items-center gap-1 text-primary text-sm">
									<BedDouble size={20} color="#181a20" />
									<span>{property.rooms} {getRoomsLabel(property.rooms || 0)}</span>
								</div>
								<div className="flex items-center gap-1 text-primary text-sm">
									<LandPlot size={20} color="#181a20" />
									<span>{property.area.toString()} m<sup>2</sup></span>
								</div>
							</div>
							<div className="flex justify-between mx-2 mt-1 text-xm text-secondary">
								<span>
									{property.listingType === "RENT" ?
										formatRentPeriod(property.rentPeriod) :
										formatListingType(property.listingType)}
								</span>
								<div className="flex gap-3">
									<SquareArrowOutUpRight size={20} color="#181a20" />
									<Heart size={20} color="#181a20" />
									<SquaresExclude size={20} color="#181a20" />
								</div>
							</div>
							<p className="absolute font-bold -mt-13 bg-white rounded-lg py-1 px-2 text-primary">
								{Number(property.price).toLocaleString("uk-UA")} грн
							</p>
						</div>
					</div>
				))}
			</Container>
	);
};

export default Page;