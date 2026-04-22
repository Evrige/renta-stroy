import type { UserRole } from "@/generated/prisma/client";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ROUTES } from "@/lib/constants/routes";
import { AUTH_COOKIE_NAMES } from "./constants";
import { findAuthUserByAccessSession, validateRefreshSession } from "./session";
import { verifyAccessToken } from "./tokens";

export async function getCurrentUser() {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get(AUTH_COOKIE_NAMES.accessToken)?.value;

	if (accessToken) {
		const accessPayload = await verifyAccessToken(accessToken);

		if (accessPayload) {
			const user = await findAuthUserByAccessSession(
				accessPayload.userId,
				accessPayload.sessionId,
			);

			if (user) {
				return user;
			}
		}
	}

	const refreshToken = cookieStore.get(AUTH_COOKIE_NAMES.refreshToken)?.value;

	if (!refreshToken) {
		return null;
	}

	const refreshSession = await validateRefreshSession(refreshToken);

	return refreshSession?.user ?? null;
}

export async function requireCurrentUser(nextPath: string = ROUTES.ACCOUNT) {
	const user = await getCurrentUser();

	if (!user) {
		redirect(`${ROUTES.LOGIN}?next=${encodeURIComponent(nextPath)}`);
	}

	return user;
}

export async function requireRole(
	role: UserRole | UserRole[],
	nextPath: string = ROUTES.ACCOUNT,
) {
	const user = await requireCurrentUser(nextPath);
	const allowedRoles = Array.isArray(role) ? role : [role];

	if (!allowedRoles.includes(user.role)) {
		redirect(ROUTES.ACCOUNT);
	}

	return user;
}
