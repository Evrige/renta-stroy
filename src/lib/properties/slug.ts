import "server-only";

import { prisma } from "@/lib/prisma";

const cyrillicMap: Record<string, string> = {
	а: "a",
	б: "b",
	в: "v",
	г: "h",
	ґ: "g",
	д: "d",
	е: "e",
	є: "ie",
	ж: "zh",
	з: "z",
	и: "y",
	і: "i",
	ї: "i",
	й: "i",
	к: "k",
	л: "l",
	м: "m",
	н: "n",
	о: "o",
	п: "p",
	р: "r",
	с: "s",
	т: "t",
	у: "u",
	ф: "f",
	х: "kh",
	ц: "ts",
	ч: "ch",
	ш: "sh",
	щ: "shch",
	ь: "",
	ю: "iu",
	я: "ia",
	ы: "y",
	э: "e",
	ъ: "",
};

function transliterateToLatin(value: string) {
	return Array.from(value).map((char, index, source) => {
		const lowerChar = char.toLowerCase();
		const previousChar = source[index - 1] ?? "";
		const isWordStart = !/[a-zа-яіїєґ0-9]/i.test(previousChar);

		if (lowerChar === "є" && isWordStart) {
			return "ye";
		}

		if (lowerChar === "ї" && isWordStart) {
			return "yi";
		}

		if (lowerChar === "й" && isWordStart) {
			return "y";
		}

		return cyrillicMap[lowerChar] ?? lowerChar;
	}).join("");
}

function slugify(value: string) {
	const normalized = transliterateToLatin(value)
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
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
