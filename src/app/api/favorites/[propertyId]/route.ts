import { PropertyApprovalStatus } from "@/generated/prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type RouteContext = {
	params: Promise<{
		propertyId: string;
	}>;
};

function parsePropertyId(value: string) {
	const propertyId = Number(value);
	return Number.isInteger(propertyId) && propertyId > 0 ? propertyId : null;
}

async function requireAuthenticatedUser() {
	const currentUser = await getCurrentUser();

	if (!currentUser) {
		return NextResponse.json(
			{
				ok: false,
				isFavorite: false,
				message: "Потрібно увійти в акаунт",
			},
			{ status: 401 },
		);
	}

	return currentUser;
}

async function ensurePropertyCanBeFavorited(propertyId: number) {
	const property = await prisma.property.findFirst({
		where: {
			id: propertyId,
			approvalStatus: PropertyApprovalStatus.APPROVED,
			status: "AVAILABLE",
		},
		select: {
			id: true,
		},
	});

	if (!property) {
		return NextResponse.json(
			{
				ok: false,
				isFavorite: false,
				message: "Оголошення не знайдено",
			},
			{ status: 404 },
		);
	}

	return property;
}

export async function POST(_: Request, { params }: RouteContext) {
	const currentUser = await requireAuthenticatedUser();

	if (currentUser instanceof NextResponse) {
		return currentUser;
	}

	const { propertyId: rawPropertyId } = await params;
	const propertyId = parsePropertyId(rawPropertyId);

	if (!propertyId) {
		return NextResponse.json(
			{
				ok: false,
				isFavorite: false,
				message: "Некоректний ідентифікатор оголошення",
			},
			{ status: 400 },
		);
	}

	const property = await ensurePropertyCanBeFavorited(propertyId);

	if (property instanceof NextResponse) {
		return property;
	}

	await prisma.favorite.upsert({
		where: {
			userId_propertyId: {
				userId: currentUser.id,
				propertyId,
			},
		},
		create: {
			userId: currentUser.id,
			propertyId,
		},
		update: {},
	});

	return NextResponse.json({
		ok: true,
		isFavorite: true,
		message: "Оголошення додано в обране",
	});
}

export async function DELETE(_: Request, { params }: RouteContext) {
	const currentUser = await requireAuthenticatedUser();

	if (currentUser instanceof NextResponse) {
		return currentUser;
	}

	const { propertyId: rawPropertyId } = await params;
	const propertyId = parsePropertyId(rawPropertyId);

	if (!propertyId) {
		return NextResponse.json(
			{
				ok: false,
				isFavorite: false,
				message: "Некоректний ідентифікатор оголошення",
			},
			{ status: 400 },
		);
	}

	await prisma.favorite.deleteMany({
		where: {
			userId: currentUser.id,
			propertyId,
		},
	});

	return NextResponse.json({
		ok: true,
		isFavorite: false,
		message: "Оголошення видалено з обраного",
	});
}
