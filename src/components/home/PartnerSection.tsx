import React from 'react';
import Image from "next/image";

const partners = [
	"/images/partner/Link1.png",
	"/images/partner/Link2.png",
	"/images/partner/Link3.png",
	"/images/partner/Link4.png",
	"/images/partner/Link5.png",
	"/images/partner/Link6.png",
];
const PartnerSection = () => {
	return (
		<section className="py-16">
			<div className="mx-auto max-w-6xl px-4">
				<p className="mb-8 text-center text-sm text-secondary">
					Нам довіряють найкращі у світі
				</p>

				<div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
					{partners.map((logo, index) => (
						<div key={index} className="flex items-center justify-center opacity-80 transition hover:opacity-100">
							<Image
								src={logo}
								alt={`Partner logo ${index + 1}`}
								width={110}
								height={40}
								className="h-auto w-auto object-contain"
							/>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default PartnerSection;
