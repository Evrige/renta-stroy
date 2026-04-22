import type { UserRole } from "@/generated/prisma/client";

export type AuthUser = {
	id: number;
	name: string;
	email: string;
	phone: string | null;
	avatar: string;
	role: UserRole;
	isActive: boolean;
};

export type SessionTokens = {
	accessToken: string;
	refreshToken: string;
};
