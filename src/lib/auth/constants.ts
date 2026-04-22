export const AUTH_COOKIE_NAMES = {
	accessToken: "rs_access_token",
	refreshToken: "rs_refresh_token",
} as const;

export const ACCESS_TOKEN_TTL_SECONDS = 60 * 15;
export const REFRESH_TOKEN_TTL_SECONDS = 60 * 60 * 24 * 30;
export const PASSWORD_MIN_LENGTH = 8;
