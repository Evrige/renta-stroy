import { createHash, randomUUID } from "node:crypto";
import type { NextResponse } from "next/server";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import {
	AUTH_COOKIE_NAMES,
	ACCESS_TOKEN_TTL_SECONDS,
	REFRESH_TOKEN_TTL_SECONDS,
} from "./constants";
import type { AuthUser, SessionTokens } from "./types";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "./tokens";

export const authUserSelect = {
	id: true,
	name: true,
	email: true,
	phone: true,
	avatar: true,
	role: true,
	isActive: true,
} satisfies Prisma.UserSelect;

type AuthUserRecord = Prisma.UserGetPayload<{
	select: typeof authUserSelect;
}>;

function hashToken(token: string) {
	return createHash("sha256").update(token).digest("hex");
}

function getRequestIpAddress(headers: Headers) {
	const forwardedFor = headers.get("x-forwarded-for");

	if (forwardedFor) {
		return forwardedFor.split(",")[0]?.trim() ?? null;
	}

	return headers.get("x-real-ip");
}

function serializeAuthUser(user: AuthUserRecord): AuthUser {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		phone: user.phone,
		avatar: user.avatar,
		role: user.role,
		isActive: user.isActive,
	};
}

function getCookieOptions(maxAge: number) {
	return {
		httpOnly: true,
		sameSite: "lax" as const,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge,
	};
}

async function buildSessionTokens(user: AuthUserRecord, sessionId: string): Promise<SessionTokens> {
	const tokenId = randomUUID();
	const [accessToken, refreshToken] = await Promise.all([
		signAccessToken({
			userId: user.id,
			role: user.role,
			sessionId,
		}),
		signRefreshToken({
			userId: user.id,
			sessionId,
			tokenId,
		}),
	]);

	return {
		accessToken,
		refreshToken,
	};
}

export function applyAuthCookies(
	response: NextResponse,
	tokens: SessionTokens,
) {
	response.cookies.set(
		AUTH_COOKIE_NAMES.accessToken,
		tokens.accessToken,
		getCookieOptions(ACCESS_TOKEN_TTL_SECONDS),
	);
	response.cookies.set(
		AUTH_COOKIE_NAMES.refreshToken,
		tokens.refreshToken,
		getCookieOptions(REFRESH_TOKEN_TTL_SECONDS),
	);
}

export function clearAuthCookies(response: NextResponse) {
	response.cookies.set(AUTH_COOKIE_NAMES.accessToken, "", {
		...getCookieOptions(0),
	});
	response.cookies.set(AUTH_COOKIE_NAMES.refreshToken, "", {
		...getCookieOptions(0),
	});
}

export async function issueSessionTokens(user: AuthUserRecord, requestHeaders: Headers) {
	const sessionId = randomUUID();
	const tokens = await buildSessionTokens(user, sessionId);

	await prisma.authSession.create({
		data: {
			id: sessionId,
			userId: user.id,
			tokenHash: hashToken(tokens.refreshToken),
			expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
			userAgent: requestHeaders.get("user-agent"),
			ipAddress: getRequestIpAddress(requestHeaders),
		},
	});

	return {
		user: serializeAuthUser(user),
		tokens,
	};
}

export async function validateRefreshSession(refreshToken: string) {
	const payload = await verifyRefreshToken(refreshToken);

	if (!payload) {
		return null;
	}

	const session = await prisma.authSession.findUnique({
		where: { id: payload.sessionId },
		include: {
			user: {
				select: authUserSelect,
			},
		},
	});

	if (
		!session ||
		session.userId !== payload.userId ||
		session.revokedAt ||
		session.expiresAt <= new Date() ||
		session.tokenHash !== hashToken(refreshToken) ||
		!session.user.isActive
	) {
		return null;
	}

	return {
		session,
		user: serializeAuthUser(session.user),
		userRecord: session.user,
	};
}

export async function rotateRefreshSession(refreshToken: string, requestHeaders: Headers) {
	const currentSession = await validateRefreshSession(refreshToken);

	if (!currentSession) {
		return null;
	}

	const nextSessionId = randomUUID();
	const tokens = await buildSessionTokens(currentSession.userRecord, nextSessionId);

	await prisma.$transaction([
		prisma.authSession.update({
			where: { id: currentSession.session.id },
			data: {
				revokedAt: new Date(),
			},
		}),
		prisma.authSession.create({
			data: {
				id: nextSessionId,
				userId: currentSession.user.id,
				tokenHash: hashToken(tokens.refreshToken),
				expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
				userAgent: requestHeaders.get("user-agent"),
				ipAddress: getRequestIpAddress(requestHeaders),
			},
		}),
	]);

	return {
		user: currentSession.user,
		tokens,
	};
}

export async function revokeRefreshSession(refreshToken: string) {
	const payload = await verifyRefreshToken(refreshToken);

	if (!payload) {
		return;
	}

	await prisma.authSession.updateMany({
		where: {
			id: payload.sessionId,
			tokenHash: hashToken(refreshToken),
			revokedAt: null,
		},
		data: {
			revokedAt: new Date(),
		},
	});
}

export async function findAuthUserByAccessSession(userId: number, sessionId: string) {
	const session = await prisma.authSession.findUnique({
		where: { id: sessionId },
		include: {
			user: {
				select: authUserSelect,
			},
		},
	});

	if (
		!session ||
		session.userId !== userId ||
		session.revokedAt ||
		session.expiresAt <= new Date() ||
		!session.user.isActive
	) {
		return null;
	}

	return serializeAuthUser(session.user);
}
