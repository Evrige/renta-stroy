import { SignJWT, jwtVerify } from "jose";
import { UserRole } from "@/generated/prisma/client";
import { env } from "@/lib/env";
import { ACCESS_TOKEN_TTL_SECONDS, REFRESH_TOKEN_TTL_SECONDS } from "./constants";

const authSecret = new TextEncoder().encode(env.AUTH_SECRET);

type AccessTokenPayload = {
	userId: number;
	role: UserRole;
	sessionId: string;
};

type RefreshTokenPayload = {
	userId: number;
	sessionId: string;
	tokenId: string;
};

function parseUserId(subject: string | undefined) {
	const userId = Number(subject);

	return Number.isInteger(userId) && userId > 0 ? userId : null;
}

export async function signAccessToken({
	userId,
	role,
	sessionId,
}: AccessTokenPayload) {
	return new SignJWT({
		role,
		sessionId,
		tokenType: "access",
	})
		.setProtectedHeader({ alg: "HS256" })
		.setSubject(String(userId))
		.setIssuedAt()
		.setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
		.sign(authSecret);
}

export async function signRefreshToken({
	userId,
	sessionId,
	tokenId,
}: RefreshTokenPayload) {
	return new SignJWT({
		sessionId,
		tokenId,
		tokenType: "refresh",
	})
		.setProtectedHeader({ alg: "HS256" })
		.setSubject(String(userId))
		.setIssuedAt()
		.setExpirationTime(`${REFRESH_TOKEN_TTL_SECONDS}s`)
		.sign(authSecret);
}

export async function verifyAccessToken(token: string) {
	try {
		const { payload } = await jwtVerify(token, authSecret);
		const userId = parseUserId(payload.sub);

		if (
			!userId ||
			payload.tokenType !== "access" ||
			typeof payload.sessionId !== "string" ||
			!Object.values(UserRole).includes(payload.role as UserRole)
		) {
			return null;
		}

		return {
			userId,
			role: payload.role as UserRole,
			sessionId: payload.sessionId,
		};
	} catch {
		return null;
	}
}

export async function verifyRefreshToken(token: string) {
	try {
		const { payload } = await jwtVerify(token, authSecret);
		const userId = parseUserId(payload.sub);

		if (
			!userId ||
			payload.tokenType !== "refresh" ||
			typeof payload.sessionId !== "string" ||
			typeof payload.tokenId !== "string"
		) {
			return null;
		}

		return {
			userId,
			sessionId: payload.sessionId,
			tokenId: payload.tokenId,
		};
	} catch {
		return null;
	}
}
