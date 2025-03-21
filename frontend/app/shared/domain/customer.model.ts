import { z } from "zod";

export const createCustomer = z.object({
	firstName: z.string().min(2).max(40),
	lastName: z.string().min(2).max(20),
	email: z.string().email(),
});

export const updateCustomer = createCustomer.extend({
	customerId: z.number(),
	company: z.string().max(80).nullish().optional().default(""),
	address: z.string().max(70).nullish().optional().default(""),
	city: z.string().max(40).nullish().optional().default(""),
	state: z.string().max(40).nullish().optional().default(""),
	country: z.string().max(40).nullish().optional().default(""),
	postalCode: z.coerce.string().max(10).nullish().optional().default(""),
	phone: z.string().max(24).nullish().optional().default(""),
	fax: z.string().max(24).nullish().optional().default(""),
});

export const customer = updateCustomer.required();

export type CreateCustomer = z.infer<typeof createCustomer>;
export type UpdateCustomer = z.infer<typeof updateCustomer>;
export type Customer = z.infer<typeof customer>;
