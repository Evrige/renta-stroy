import "server-only";

import { PropertyApprovalStatus, type ListingType, type Prisma, type PropertyType } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type PropertyFilters = {
	city?: string;
	listingType?: ListingType;
	propertyType?: PropertyType;
	rooms?: number;
	minPrice?: number;
	maxPrice?: number;
};

export const getFeaturedProperties = async () => {
	return prisma.property.findMany({
		where: {
			approvalStatus: PropertyApprovalStatus.APPROVED,
			status: "AVAILABLE",
		},
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
};

export const getPropertyTypeCounts = async () => {
	return prisma.property.groupBy({
		by: ["propertyType"],
		where: {
			approvalStatus: PropertyApprovalStatus.APPROVED,
			status: "AVAILABLE",
		},
		_count: {
			propertyType: true,
		},
	});
};

const buildPropertiesWhere = ({
	city,
	listingType,
	propertyType,
	rooms,
	minPrice,
	maxPrice,
}: PropertyFilters): Prisma.PropertyWhereInput => ({
	status: "AVAILABLE",
	approvalStatus: PropertyApprovalStatus.APPROVED,
	...(listingType && { listingType }),
	...(propertyType && { propertyType }),
	...(rooms && { rooms }),
	...((minPrice || maxPrice) && {
		price: {
			...(minPrice && { gte: minPrice }),
			...(maxPrice && { lte: maxPrice }),
		},
	}),
	...(city && {
		location: {
			city,
		},
	}),
});

export const getFilteredProperties = async (filters: PropertyFilters) => {
	return prisma.property.findMany({
		where: buildPropertiesWhere(filters),
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
};

export const getPropertyBySlug = async (slug: string) => {
	return prisma.property.findFirst({
		where: {
			slug,
			approvalStatus: PropertyApprovalStatus.APPROVED,
		},
		include: {
			location: true,
			images: true,
		},
	});
};
