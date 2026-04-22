import { UserRole } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { buildPropertyUpdateData } from "@/lib/crm/property-mutations";
import { propertyPayloadSchema } from "@/lib/crm/validation";
import { prisma } from "@/lib/prisma";

type RouteContext = {
	params: Promise<{
		id: string;
	}>;
};

function parsePropertyId(value: string) {
	const propertyId = Number(value);
	return Number.isInteger(propertyId) && propertyId > 0 ? propertyId : null;
}

export async function PATCH(request: Request, { params }: RouteContext) {
	const currentUser = await getCurrentUser();

	if (
		!currentUser ||
		(currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.MANAGER)
	) {
		return NextResponse.json(
			{
				ok: false,
				message: "Недостатньо прав для редагування оголошення",
			},
			{ status: 403 },
		);
	}

	const { id } = await params;
	const propertyId = parsePropertyId(id);

	if (!propertyId) {
		return NextResponse.json(
			{
				ok: false,
				message: "Некоректний ідентифікатор оголошення",
			},
			{ status: 400 },
		);
	}

	try {
		const body = await request.json();
		const data = propertyPayloadSchema.parse(body);

		const existingProperty = await prisma.property.findUnique({
			where: {
				id: propertyId,
			},
			select: {
				id: true,
			},
		});

		if (!existingProperty) {
			return NextResponse.json(
				{
					ok: false,
					message: "Оголошення не знайдено",
				},
				{ status: 404 },
			);
		}

		const property = await prisma.property.update({
			where: {
				id: propertyId,
			},
			data: await buildPropertyUpdateData(propertyId, data),
			select: {
				id: true,
				title: true,
				slug: true,
				approvalStatus: true,
			},
		});

		return NextResponse.json({
			ok: true,
			property,
			message: "Оголошення оновлено",
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					ok: false,
					message: error.issues[0]?.message ?? "Перевірте дані оголошення",
				},
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				ok: false,
				message: "Не вдалося оновити оголошення",
			},
			{ status: 500 },
		);
	}
}
