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

type PropertyPagination = {
	page?: number;
	perPage?: number;
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

const propertyCardSelect = {
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
} satisfies Prisma.PropertySelect;

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

export const getFilteredProperties = async (
	filters: PropertyFilters,
	pagination: PropertyPagination = {},
) => {
	const where = buildPropertiesWhere(filters);
	const perPage = pagination.perPage ?? 12;
	const requestedPage = Math.max(1, pagination.page ?? 1);
	const totalCount = await prisma.property.count({ where });
	const totalPages = totalCount > 0 ? Math.ceil(totalCount / perPage) : 0;
	const currentPage = totalPages > 0 ? Math.min(requestedPage, totalPages) : 1;

	const properties =
		totalCount > 0
			? await prisma.property.findMany({
					where,
					select: propertyCardSelect,
					orderBy: {
						createdAt: "desc",
					},
					skip: (currentPage - 1) * perPage,
					take: perPage,
				})
			: [];

	return {
		properties,
		totalCount,
		totalPages,
		currentPage,
		perPage,
	};
};

export async function getFavoritePropertyIds(userId: number, propertyIds: number[]) {
	if (!propertyIds.length) {
		return [];
	}

	const favorites = await prisma.favorite.findMany({
		where: {
			userId,
			propertyId: {
				in: propertyIds,
			},
		},
		select: {
			propertyId: true,
		},
	});

	return favorites.map((favorite) => favorite.propertyId);
}

export async function getUserFavoriteProperties(userId: number) {
	const favorites = await prisma.favorite.findMany({
		where: {
			userId,
			property: {
				approvalStatus: PropertyApprovalStatus.APPROVED,
				status: "AVAILABLE",
			},
		},
		orderBy: {
			createdAt: "desc",
		},
		select: {
			property: {
				select: propertyCardSelect,
			},
		},
	});

	return favorites.map((favorite) => favorite.property);
}

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
