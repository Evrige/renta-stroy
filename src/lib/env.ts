function getEnv(name: string): string {
	const value = process.env[name];

	if (!value) {
		throw new Error(`Missing env variable: ${name}`);
	}

	return value;
}

export const env = {
	DATABASE_URL: getEnv("DATABASE_URL"),
	AUTH_SECRET: getEnv("AUTH_SECRET"),
	APP_NAME: getEnv("NEXT_PUBLIC_APP_NAME"),
	APP_URL: getEnv("NEXT_PUBLIC_APP_URL"),
};