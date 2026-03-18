import React from 'react';
const featuredListings = [
	{
		id: 1,
		title: "Modern Villa",
		location: "Dnipro, Ukraine",
		price: "$450,000",
		image: "/images/property-1.jpg",
	},
	{
		id: 2,
		title: "Luxury House",
		location: "Kyiv, Ukraine",
		price: "$520,000",
		image: "/images/property-2.jpg",
	},
	{
		id: 3,
		title: "Family Home",
		location: "Lviv, Ukraine",
		price: "$310,000",
		image: "/images/property-3.jpg",
	},
];
const Slider = () => {
	return (
		<section className="mx-auto max-w-7xl px-6 py-20">
			<div className="mb-10 flex items-end justify-between gap-4">
				<div>
					<h2 className="text-4xl font-bold text-gray-900">
						Discover Our Featured Listings
					</h2>
					<p className="mt-3 text-sm text-gray-500">
						Aliquam lacinia diam quis lacus euismod
					</p>
				</div>

				<a
					href="/properties"
					className="text-sm font-semibold text-gray-900 transition hover:text-orange-500"
				>
					See All Properties →
				</a>
			</div>

			<div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
				{featuredListings.map((listing) => (
					<article
						key={listing.id}
						className="overflow-hidden rounded-3xl bg-white shadow-md transition hover:-translate-y-1 hover:shadow-xl"
					>
						<div className="relative h-72 w-full">
							<img
								src={listing.image}
								alt={listing.title}
								className="h-full w-full object-cover"
							/>
							<span className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-xs font-semibold text-white">
                  FEATURED
                </span>
						</div>

						<div className="p-6">
							<h3 className="text-xl font-semibold text-gray-900">
								{listing.title}
							</h3>
							<p className="mt-2 text-sm text-gray-500">{listing.location}</p>
							<p className="mt-4 text-lg font-bold text-orange-500">
								{listing.price}
							</p>
						</div>
					</article>
				))}
			</div>
		</section>
	);
};

export default Slider;