import { z } from "zod";

export const AuthenticationFormData = z.discriminatedUnion("action", [
	z.object({
		email: z.string().email(),
		password: z.string().min(6),
		action: z.literal("login"),
	}),
	z.object({
		email: z.string().email(),
		password: z.string().min(6),
		name: z.string(),
		terms: z.boolean().default(false),
		action: z.literal("register"),
	}),
	z.object({
		email: z.string().email().optional(),
		password: z.string().min(6).optional(),
		action: z.literal("sso"),
	}),
]);

export type AuthenticationFormData = z.infer<typeof AuthenticationFormData>;
