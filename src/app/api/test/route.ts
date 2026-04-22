import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
	const users = await prisma.user.findMany({
		take: 5,
		select: {
			id: true,
			name: true,
			email: true,
			role: true,
			isActive: true,
		},
	});

	return NextResponse.json({
		ok: true,
		users,
	});
}
