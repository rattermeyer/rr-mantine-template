import type { OAuth2Tokens } from "arctic";
import { z } from "zod";

export const preferenceEntry = z.object({
	key: z.string(),
	value: z.string(),
	category: z.string(),
});
export type PreferenceEntry = z.infer<typeof preferenceEntry>;

export const createAccount = z.object({
	uuid: z.string().uuid().optional(),
	email: z.string().email(),
	name: z.string().min(3).max(100),
	passwordHash: z.string().max(128).optional(),
	preferences: z.array(preferenceEntry).optional().default([]),
	emailVerified: z.boolean().optional().default(false),
	roles: z.array(z.string()).optional().default([]),
});

export const updateAccount = createAccount
	.required({
		uuid: true,
	})
	.partial({
		name: true,
		preferences: true,
	});

export const account = createAccount.required({
	uuid: true,
	email: true,
	preferences: true,
	emailVerified: true,
	roles: true,
});

export type CreateAccount = z.input<typeof createAccount> & {
	tokens?: OAuth2Tokens;
};
export type UpdateAccount = z.infer<typeof updateAccount> & {
	tokens?: OAuth2Tokens;
};
export type Account = z.infer<typeof account> & { tokens?: OAuth2Tokens };
