import type { Insertable, Selectable, Updateable } from "kysely";
import type {
	Account as AccountTable,
	Customer as CustomerTable,
	CustomerView,
} from "./tables";

export type AccountEntity = Selectable<AccountTable>;
export type NewAccountEntity = Insertable<AccountTable>;
export type UpdatableAccountEntity = Updateable<AccountTable>;

export type CustomerEntity = Selectable<CustomerTable>;
export type NewCustomerEntity = Insertable<CustomerTable>;
export type UpdatableCustomerEntity = Updateable<CustomerTable>;
export type NullableCustomerEntity = Omit<CustomerEntity, "customerId"> & { customerId: number };
