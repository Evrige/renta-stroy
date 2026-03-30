import React from 'react';
import {Container} from "@/components/layout/Container";
import {prisma} from "@/lib/prisma";
import Image from "next/image";
import {MessageSquareQuote, Star} from "lucide-react";

const ReviewSection = async () => {
	const reviews = await prisma.review.findMany({
		include: {
			user: {
				select: {
					id: true,
					name: true,
					avatar: true,
				},
			},
		},
		orderBy: {
			createdAt: "desc",
		},
	});
	return (
		<section>
			<Container>
				<div className="mt-10">
					<div className="flex flex-col items-center gap-3 text-center">
						<h2 className="text-3xl font-semibold text-primary">Люди полюбляють роботу з нами</h2>
						<p className="max-w-2xl text-secondary">
							Домопомежо кожному з його питанням
						</p>
					</div>
				</div>
				<div>
					<div className="flex gap-3 mt-5">
						{reviews.map(review => {
							return (
								<div key={review.id}
										 className="relative rounded-2xl bg-bg-secondary/20 p-5 border border-secondary/10 shadow-sm ring-1 ring-black/5">
									<MessageSquareQuote size={40} className="text-secondary/50 absolute top-4 right-4"/>
									<div className="flex">
										<Image src={review.user.avatar || ""} alt="Фото профілю" width={80} height={80}
													 className="rounded-full"></Image>
										<div className="mt-2 items-center ml-2">
											<span className="text-primary">{review.user.name}</span>
											<div className="flex gap-1 mt-1">
												{Array.from({length: 5}).map((_, index) => (
													<Star
														key={index}
														className={index < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
													/>
												))}
											</div>
										</div>
									</div>
									<p className="text-secondary mt-2">
										{review.comment}
									</p>
								</div>
							)
						})}
					</div>
				</div>
			</Container>
		</section>
	);
};

export default ReviewSection;
