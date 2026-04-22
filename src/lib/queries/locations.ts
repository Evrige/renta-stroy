import "server-only";

import { prisma } from "@/lib/prisma";

export const getCities = async () => {
	return prisma.location.findMany({
		select: {
			city: true,
		},
		distinct: ["city"],
		orderBy: {
			city: "asc",
		},
	});
};
