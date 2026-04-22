import "server-only";

import { prisma } from "@/lib/prisma";

export const getLatestReviews = async () => {
	return prisma.review.findMany({
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
};
