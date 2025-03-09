import type {Account as AccountTable, Customer as CustomerTable, CustomerView} from './tables';
import type {Insertable, Selectable, Updateable} from 'kysely';

export type Account = Selectable<AccountTable>;
export type NewAccount = Insertable<AccountTable>;
export type UpdatableAccount = Updateable<AccountTable>;

export type Customer = Selectable<CustomerTable>;
export type NewCustomer = Insertable<CustomerTable>;
export type UpdatableCustomer = Updateable<CustomerTable>;

