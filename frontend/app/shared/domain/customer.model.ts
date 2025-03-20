import { z } from "zod";

export const createCustomer = z.object({
	firstName: z.string().min(2).max(40),
	lastName: z.string().min(2).max(20),
	email: z.string().email(),
});

export const updateCustomer = createCustomer.extend({
	customerId: z.number(),
	company: z.string().max(80).optional(),
	address: z.string().max(70).optional(),
	city: z.string().max(40).optional(),
	state: z.string().max(40).optional(),
	country: z.string().max(40).optional(),
	postalCode: z.coerce.string().max(10).optional(),
	phone: z.string().max(24).optional(),
	fax: z.string().max(24).optional(),
});

export const customer = updateCustomer.required();

export type CreateCustomer = z.infer<typeof createCustomer>;
export type UpdateCustomer = z.infer<typeof updateCustomer>;
export type Customer = z.infer<typeof customer>;
