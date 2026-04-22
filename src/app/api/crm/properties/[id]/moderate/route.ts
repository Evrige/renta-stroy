import { PropertyApprovalStatus, PropertyStatus, UserRole } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { propertyModerationSchema } from "@/lib/crm/validation";
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

export async function POST(request: Request, { params }: RouteContext) {
	const currentUser = await getCurrentUser();

	if (
		!currentUser ||
		(currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.MANAGER)
	) {
		return NextResponse.json(
			{
				ok: false,
				message: "Недостатньо прав для модерації",
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
		const data = propertyModerationSchema.parse(body);
		const now = new Date();

		const property = await prisma.property.update({
			where: {
				id: propertyId,
			},
			data: {
				approvalStatus: data.decision,
				moderationNotes: data.moderationNotes,
				reviewedAt: now,
				publishedAt:
					data.decision === PropertyApprovalStatus.APPROVED ? now : null,
				status:
					data.decision === PropertyApprovalStatus.APPROVED
						? PropertyStatus.AVAILABLE
						: PropertyStatus.INACTIVE,
				reviewedById: currentUser.id,
				managerId:
					currentUser.role === UserRole.MANAGER
						? currentUser.id
						: undefined,
			},
			select: {
				id: true,
				title: true,
				approvalStatus: true,
				moderationNotes: true,
			},
		});

		return NextResponse.json({
			ok: true,
			property,
			message:
				data.decision === PropertyApprovalStatus.APPROVED
					? "Оголошення опубліковано"
					: data.decision === PropertyApprovalStatus.REJECTED
						? "Оголошення відхилено"
						: "Оголошення відправлено на доопрацювання",
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					ok: false,
					message: error.issues[0]?.message ?? "Перевірте дані модерації",
				},
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{
				ok: false,
				message: "Не вдалося завершити модерацію",
			},
			{ status: 500 },
		);
	}
}
