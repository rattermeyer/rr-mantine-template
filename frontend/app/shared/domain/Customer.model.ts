import {z} from 'zod';

export const createCustomer = z.object({
    firstName: z.string().min(2).max(40),
    lastName: z.string().min(2).max(20),
    email: z.string().email()
})

export const updateCustomer = createCustomer.extend({
    customerId: z.number(),
    company: z.string().max(80).nullish(),
    address: z.string().max(70).nullish(),
    city: z.string().max(40).nullish(),
    state: z.string().max(40).nullish(),
    country: z.string().max(40).nullish(),
    postalCode: z.string().max(10).nullish(),
    phone: z.string().max(24).nullish(),
    fax: z.string().max(24).nullish(),
})

export const customer = updateCustomer.required()

export type CreateCustomer = z.infer<typeof createCustomer>
export type UpdateCustomer = z.infer<typeof updateCustomer>
export type Customer = z.infer<typeof customer>

