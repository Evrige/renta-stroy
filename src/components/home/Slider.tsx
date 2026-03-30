import React from "react";
import Image from "next/image";
import Link from "next/link";
import {prisma} from "@/lib/prisma";
import {Container} from "@/components/layout/Container";
import {formatPrice} from "@/app/utils/formatters";
import {ROUTES} from "@/lib/constants/routes";

const Slider = async () => {
	const featuredListings = await prisma.property.findMany({
		select: {
			id: true,
			slug: true,
			title: true,
			price: true,
			location: {
				select: {
					city: true,
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
		take: 3,
	});

	return (
		<section className="py-20">
			<Container>
				<div className="mb-10 flex items-end justify-between gap-4">
					<div>
						<h2 className="text-4xl font-bold text-primary">
							Рекомендовані об&apos;єкти
						</h2>
						<p className="mt-3 text-sm text-secondary">
							Актуальні пропозиції, які можуть вас зацікавити
						</p>
					</div>

					<Link
						href="/properties"
						className="text-sm font-semibold text-primary transition hover:opacity-70"
					>
						Усі об&apos;єкти
					</Link>
				</div>

				<div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
					{featuredListings.map((listing) => (
						<Link key={listing.id} href={ROUTES.PROPERTY_DETAILS(listing.slug)} className="h-full">
							<article
								className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl">
								<div className="relative h-72 w-full">
									<Image
										src={listing.images[0]?.url || "/images/test.png"}
										alt={listing.images[0]?.alt || listing.title}
										fill
										className="object-cover"
									/>
									<span
										className="absolute left-4 top-4 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
            Рекомендовано
          </span>
								</div>

								<div className="flex flex-1 flex-col p-6">
									<h3 className="line-clamp-2 min-h-[64px] text-xl font-semibold text-primary">
										{listing.title}
									</h3>

									<p className="mt-2 text-sm text-secondary">
										{listing.location.city}
									</p>

									<p className="mt-auto pt-4 text-lg font-bold text-primary">
										{formatPrice(listing.price)} грн
									</p>
								</div>
							</article>
						</Link>
					))}
				</div>
			</Container>
		</section>
	);
};

export default Slider;
