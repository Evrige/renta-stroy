import "server-only";

import { PropertyApprovalStatus, UserRole, type Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

const crmPropertyListSelect = {
	id: true,
	title: true,
	slug: true,
	listingType: true,
	propertyType: true,
	price: true,
	status: true,
	approvalStatus: true,
	createdAt: true,
	publishedAt: true,
	moderationNotes: true,
	location: {
		select: {
			city: true,
			district: true,
		},
	},
	owner: {
		select: {
			id: true,
			name: true,
			email: true,
		},
	},
	createdBy: {
		select: {
			id: true,
			name: true,
			email: true,
		},
	},
	manager: {
		select: {
			id: true,
			name: true,
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

export async function getCrmDashboardData(currentUserId: number, role: UserRole) {
	const managedPropertyFilter: Prisma.PropertyWhereInput =
		role === UserRole.ADMIN
			? {}
			: {
					OR: [
						{ managerId: currentUserId },
						{ createdById: currentUserId },
						{ reviewedById: currentUserId },
					],
				};

	const [summary, pendingProperties, managedProperties] = await Promise.all([
		prisma.property.groupBy({
			by: ["approvalStatus"],
			_count: {
				approvalStatus: true,
			},
		}),
		prisma.property.findMany({
			where: {
				approvalStatus: {
					in: [
						PropertyApprovalStatus.PENDING_REVIEW,
						PropertyApprovalStatus.NEEDS_REVISION,
					],
				},
			},
			select: crmPropertyListSelect,
			orderBy: {
				createdAt: "desc",
			},
			take: 10,
		}),
		prisma.property.findMany({
			where: managedPropertyFilter,
			select: crmPropertyListSelect,
			orderBy: {
				updatedAt: "desc",
			},
			take: 12,
		}),
	]);

	return {
		summary,
		pendingProperties,
		managedProperties,
	};
}

export async function getCrmPropertyById(propertyId: number) {
	return prisma.property.findUnique({
		where: {
			id: propertyId,
		},
		include: {
			location: true,
			images: {
				orderBy: {
					id: "asc",
				},
			},
			owner: {
				select: {
					id: true,
					name: true,
					email: true,
					phone: true,
				},
			},
			createdBy: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			reviewedBy: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
			manager: {
				select: {
					id: true,
					name: true,
					email: true,
				},
			},
		},
	});
}

export async function getCrmUsers() {
	return prisma.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
			phone: true,
			role: true,
			isActive: true,
			createdAt: true,
			_count: {
				select: {
					authSessions: true,
					ownedProperties: true,
					createdProperties: true,
					requests: true,
					favorites: true,
				},
			},
		},
		orderBy: [
			{
				role: "asc",
			},
			{
				createdAt: "desc",
			},
		],
	});
}

export async function getUserOwnedProperties(userId: number) {
	return prisma.property.findMany({
		where: {
			ownerId: userId,
		},
		select: crmPropertyListSelect,
		orderBy: {
			createdAt: "desc",
		},
	});
}
