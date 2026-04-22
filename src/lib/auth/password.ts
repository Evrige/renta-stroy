import argon2 from "argon2";

const PASSWORD_HASH_PREFIX = "$argon2";

const argonOptions: argon2.Options & { raw?: false } = {
	type: argon2.argon2id,
	memoryCost: 19_456,
	timeCost: 2,
	parallelism: 1,
};

export async function hashPassword(password: string) {
	return argon2.hash(password, argonOptions);
}

export async function verifyPassword(password: string, storedPasswordHash: string) {
	if (!storedPasswordHash.startsWith(PASSWORD_HASH_PREFIX)) {
		return {
			isValid: storedPasswordHash === password,
			needsUpgrade: true,
		};
	}

	const isValid = await argon2.verify(storedPasswordHash, password);

	return {
		isValid,
		needsUpgrade: isValid ? argon2.needsRehash(storedPasswordHash, argonOptions) : false,
	};
}
