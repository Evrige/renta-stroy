import { type NextRequest, NextResponse } from "next/server";
import { AUTH_COOKIE_NAMES } from "@/lib/auth/constants";
import { clearAuthCookies, revokeRefreshSession } from "@/lib/auth/session";

export async function POST(request: NextRequest) {
	const refreshToken = request.cookies.get(AUTH_COOKIE_NAMES.refreshToken)?.value;

	if (refreshToken) {
		await revokeRefreshSession(refreshToken);
	}

	const response = NextResponse.json({
		ok: true,
	});

	clearAuthCookies(response);

	return response;
}
