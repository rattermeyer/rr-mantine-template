import type { interfaces } from "inversify";
import type {
	Account,
	CreateAccount,
	PreferenceEntry,
} from "~/shared/domain/account.model";

export interface AccountRepository {
	createAccount(account: CreateAccount): Promise<Account | undefined>;
	findAccountByEmail(email: string): Promise<Account | undefined>;
	findAccountByUuid(uuid: string): Promise<Account | undefined>;
	findPreferencesByUuid(
		uuid: string,
		category?: string,
		key?: string,
	): Promise<PreferenceEntry[] | undefined>;
	updatePreference(
		accountUuid: string,
		category: string,
		key: string,
		value: string,
	): Promise<void>;
}

export namespace AccountRepository {
	export const type: interfaces.ServiceIdentifier<AccountRepository> =
		Symbol.for("AccountRepository");
}
