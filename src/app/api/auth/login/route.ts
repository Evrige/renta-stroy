import { NextResponse } from "next/server";
import { z } from "zod";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { applyAuthCookies, authUserSelect, issueSessionTokens } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

const loginSchema = z.object({
	email: z
		.string()
		.trim()
		.email("Вкажіть коректний email")
		.transform((value) => value.toLowerCase()),
	password: z.string().min(1, "Вкажіть пароль"),
});

export async function POST(request: Request) {
	try {
		const body = await request.json();
		const data = loginSchema.parse(body);

		const user = await prisma.user.findUnique({
			where: { email: data.email },
			select: {
				...authUserSelect,
				passwordHash: true,
			},
		});

		if (!user || !user.isActive) {
			return NextResponse.json(
				{
					ok: false,
					message: "Невірний email або пароль",
				},
				{ status: 401 },
			);
		}

		const passwordCheck = await verifyPassword(data.password, user.passwordHash);

		if (!passwordCheck.isValid) {
			return NextResponse.json(
				{
					ok: false,
					message: "Невірний email або пароль",
				},
				{ status: 401 },
			);
		}

		if (passwordCheck.needsUpgrade) {
			await prisma.user.update({
				where: { id: user.id },
				data: {
					passwordHash: await hashPassword(data.password),
				},
			});
		}

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

		return NextResponse.json(
			{
				ok: false,
				message: "Не вдалося виконати вхід",
			},
			{ status: 500 },
		);
	}
}
