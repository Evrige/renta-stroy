import { Prisma } from "@/generated/prisma/client";
import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword } from "@/lib/auth/password";
import { applyAuthCookies, authUserSelect, issueSessionTokens } from "@/lib/auth/session";
import { registerPayloadSchema } from "@/lib/auth/validation";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const data = registerPayloadSchema.parse(body);

		const existingUser = await prisma.user.findUnique({
			where: { email: data.email },
			select: { id: true },
		});

		if (existingUser) {
			return NextResponse.json(
				{
					ok: false,
					message: "Користувач з таким email вже існує",
				},
				{ status: 409 },
			);
		}

		const user = await prisma.user.create({
			data: {
				name: data.name,
				email: data.email,
				passwordHash: await hashPassword(data.password),
				phone: data.phone,
			},
			select: authUserSelect,
		});

		const session = await issueSessionTokens(user, request.headers);
		const response = NextResponse.json({
			ok: true,
			user: session.user,
		});

		applyAuthCookies(response, session.tokens);

		return response;
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{
					ok: false,
					message: error.issues[0]?.message ?? "Некоректні дані",
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
				message: "Не вдалося створити акаунт",
			},
			{ status: 500 },
		);
	}
}
