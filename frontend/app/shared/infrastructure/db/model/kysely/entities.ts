import type { Insertable, Selectable, Updateable } from "kysely";
import { z } from "zod";
import type {
	Account as AccountTable,
	Customer as CustomerTable,
	Netflix,
} from "./tables";

export type AccountEntity = Selectable<AccountTable>;
export type NewAccountEntity = Insertable<AccountTable>;
export type UpdatableAccountEntity = Updateable<AccountTable>;

export type CustomerEntity = Selectable<CustomerTable>;
export type NewCustomerEntity = Insertable<CustomerTable>;
export type UpdatableCustomerEntity = Updateable<CustomerTable>;
export type NullableCustomerEntity = Omit<CustomerEntity, "customerId"> & {
	customerId: number;
};

export type NetflixEntity = Selectable<Netflix>;
export const netflixEntity = z.object({
	casts: z.string().nullish().optional().default(""),
	country: z.string().nullish().optional().default(""),
	dateAdded: z.string().nullish().optional().default(""),
	description: z.string().nullish().optional().default(""),
	director: z.string().nullish().optional().default(""),
	duration: z.string().nullish().optional().default(""),
	listedIn: z.string().nullish().optional().default(""),
	rating: z.string().nullish().optional().default(""),
	releaseYear: z.number().nullish().optional().default(0),
	showId: z.string().nullish().optional().default(""),
	title: z.string().nullish().optional().default(""),
	type: z.string().nullish().optional().default(""),
});
