import type {Account as AccountTable} from './database';
import type {Insertable, Selectable, Updateable} from 'kysely';

export type Account = Selectable<AccountTable>;
export type NewAccount = Insertable<AccountTable>;
export type UpdatableAccount = Updateable<AccountTable>;

