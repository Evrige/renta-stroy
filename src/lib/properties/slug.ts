import "server-only";

import { prisma } from "@/lib/prisma";

function slugify(value: string) {
	const normalized = value
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^\p{Letter}\p{Number}]+/gu, "-")
		.replace(/^-+|-+$/g, "")
		.replace(/-{2,}/g, "-");

	return normalized || `listing-${Date.now()}`;
}

export async function generateUniquePropertySlug(title: string, excludeId?: number) {
	const baseSlug = slugify(title);
	let candidate = baseSlug;
	let suffix = 1;

	while (true) {
		const existingProperty = await prisma.property.findFirst({
			where: {
				slug: candidate,
				...(excludeId ? { id: { not: excludeId } } : {}),
			},
			select: {
				id: true,
			},
		});

		if (!existingProperty) {
			return candidate;
		}

		suffix += 1;
		candidate = `${baseSlug}-${suffix}`;
	}
}
