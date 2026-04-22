import { Prisma, UserRole } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth";
import { crmUserUpdateSchema } from "@/lib/crm/validation";
import { prisma } from "@/lib/prisma";

type RouteContext = {
	params: Promise<{
		id: string;
	}>;
};

function parseUserId(value: string) {
	const userId = Number(value);
	return Number.isInteger(userId) && userId > 0 ? userId : null;
}

export async function PATCH(request: Request, { params }: RouteContext) {
	const currentUser = await getCurrentUser();

	if (!currentUser || currentUser.role !== UserRole.ADMIN) {
		return NextResponse.json(
			{
				ok: false,
				message: "Лише адміністратор може керувати користувачами",
			},
			{ status: 403 },
		);
	}

	const { id } = await params;
	const userId = parseUserId(id);

	if (!userId) {
		return NextResponse.json(
			{
				ok: false,
				message: "Некоректний ідентифікатор користувача",
			},
			{ status: 400 },
		);
	}

	try {
		const body = await request.json();
		const data = crmUserUpdateSchema.parse(body);

		if (currentUser.id === userId && (!data.isActive || data.role !== UserRole.ADMIN)) {
			return NextResponse.json(
				{
					ok: false,
					message: "Не можна деактивувати або понизити власний акаунт адміністратора",
				},
				{ status: 400 },
			);
		}

		const updatedUser = await prisma.user.update({
			where: {
				id: userId,
			},
			data: {
				name: data.name,
				email: data.email,
				phone: data.phone,
				role: data.role,
				isActive: data.isActive,
			},
			select: {
				id: true,
				name: true,
				email: true,
				phone: true,
				role: true,
				isActive: true,
			},
		});

		if (!data.isActive) {
			await prisma.authSession.updateMany({
				where: {
					userId,
					revokedAt: null,
				},
				data: {
					revokedAt: new Date(),
				},
			});
		}

		return NextResponse.json({
			ok: true,
			user: updatedUser,
			message: "Дані користувача оновлено",
		});
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					ok: false,
					message: error.issues[0]?.message ?? "Перевірте дані користувача",
				},
				{ status: 400 },
			);
		}

		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === "P2002"
		) {
			return NextResponse.json(
				{
					ok: false,
					message: "Користувач з таким email вже існує",
				},
				{ status: 409 },
			);
		}

		return NextResponse.json(
			{
				ok: false,
				message: "Не вдалося оновити користувача",
			},
			{ status: 500 },
		);
	}
}
