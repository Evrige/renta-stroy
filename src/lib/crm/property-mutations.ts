import "server-only";

import type { Prisma, UserRole } from "@/generated/prisma/client";
import { generateUniquePropertySlug } from "@/lib/properties/slug";
import type { z } from "zod";
import type { propertyPayloadSchema } from "./validation";

type PropertyPayload = z.infer<typeof propertyPayloadSchema>;

function buildImageCreateData(title: string, imageUrls: string[]) {
	return imageUrls.map((url, index) => ({
		url,
		alt: `${title} - фото ${index + 1}`,
		isMain: index === 0,
	}));
}

export async function buildPropertyCreateData(
	data: PropertyPayload,
	options: {
		createdById: number;
		role: UserRole;
		asSubmission?: boolean;
	},
): Promise<Prisma.PropertyCreateInput> {
	const slug = await generateUniquePropertySlug(data.title);
	const isSubmission = options.asSubmission ?? false;
	const now = new Date();

	return {
		title: data.title,
		slug,
		description: data.description,
		listingType: data.listingType,
		propertyType: data.propertyType,
		rentPeriod: data.rentPeriod,
		price: data.price,
		area: data.area,
		rooms: data.rooms,
		floor: data.floor,
		totalFloors: data.totalFloors,
		bathrooms: data.bathrooms,
		parking: data.parking,
		furnished: data.furnished,
		status: isSubmission ? "INACTIVE" : data.status,
		approvalStatus: isSubmission
			? "PENDING_REVIEW"
			: "APPROVED",
		publishedAt: isSubmission ? null : now,
		reviewedAt: isSubmission ? null : now,
		moderationNotes: null,
		createdBy: {
			connect: {
				id: options.createdById,
			},
		},
		owner: isSubmission
			? {
					connect: {
						id: options.createdById,
					},
				}
			: undefined,
		reviewedBy: isSubmission
			? undefined
			: {
					connect: {
						id: options.createdById,
					},
				},
		manager:
			options.role === "MANAGER"
				? {
						connect: {
							id: options.createdById,
						},
					}
				: undefined,
		location: {
			create: {
				country: data.country,
				city: data.city,
				district: data.district,
				street: data.street,
				building: data.building,
				latitude: data.latitude,
				longitude: data.longitude,
			},
		},
		images: {
			create: buildImageCreateData(data.title, data.imageUrls),
		},
	};
}

export async function buildPropertyUpdateData(
	propertyId: number,
	data: PropertyPayload,
): Promise<Prisma.PropertyUpdateInput> {
	const slug = await generateUniquePropertySlug(data.title, propertyId);

	return {
		title: data.title,
		slug,
		description: data.description,
		listingType: data.listingType,
		propertyType: data.propertyType,
		rentPeriod: data.rentPeriod,
		price: data.price,
		area: data.area,
		rooms: data.rooms,
		floor: data.floor,
		totalFloors: data.totalFloors,
		bathrooms: data.bathrooms,
		parking: data.parking,
		furnished: data.furnished,
		status: data.status,
		location: {
			update: {
				country: data.country,
				city: data.city,
				district: data.district,
				street: data.street,
				building: data.building,
				latitude: data.latitude,
				longitude: data.longitude,
			},
		},
		images: {
			deleteMany: {},
			create: buildImageCreateData(data.title, data.imageUrls),
		},
	};
}
