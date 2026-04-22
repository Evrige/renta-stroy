import { type NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAMES } from "@/lib/auth/constants";
import {
	applyAuthCookies,
	clearAuthCookies,
	rotateRefreshSession,
} from "@/lib/auth/session";

export async function POST(request: NextRequest) {
	const refreshToken = request.cookies.get(AUTH_COOKIE_NAMES.refreshToken)?.value;

	if (!refreshToken) {
		const response = NextResponse.json(
			{
				ok: false,
				message: "Сесію не знайдено",
			},
			{ status: 401 },
		);

		clearAuthCookies(response);

		return response;
	}

	const session = await rotateRefreshSession(refreshToken, request.headers);

	if (!session) {
		const response = NextResponse.json(
			{
				ok: false,
				message: "Сесія недійсна або протермінована",
			},
			{ status: 401 },
		);

		clearAuthCookies(response);

		return response;
	}

	const response = NextResponse.json({
		ok: true,
		user: session.user,
	});

	applyAuthCookies(response, session.tokens);

	return response;
}
