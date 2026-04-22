import { UserRole } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { buildPropertyCreateData } from "@/lib/crm/property-mutations";
import { propertyPayloadSchema } from "@/lib/crm/validation";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
	const currentUser = await getCurrentUser();

	if (
		!currentUser ||
		(currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.MANAGER)
	) {
		return NextResponse.json(
			{
				ok: false,
				message: "Недостатньо прав для створення оголошення",
			},
			{ status: 403 },
		);
	}

	try {
		const body = await request.json();
		const data = propertyPayloadSchema.parse(body);

		const property = await prisma.property.create({
			data: await buildPropertyCreateData(data, {
				createdById: currentUser.id,
				role: currentUser.role,
			}),
			select: {
				id: true,
				title: true,
				slug: true,
			},
		});

		return NextResponse.json({
			ok: true,
			property,
			message: "Оголошення створено",
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
				message: "Не вдалося створити оголошення",
			},
			{ status: 500 },
		);
	}
}
