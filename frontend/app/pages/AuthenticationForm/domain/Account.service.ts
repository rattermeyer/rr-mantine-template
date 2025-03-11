import argon2 from "argon2";
import type {Kysely} from "kysely";
import type {DB} from "kysely-codegen";
import type {AccountRepository} from "~/pages/AuthenticationForm/domain/Account.repository";
import type {Account, CreateAccount} from "~/shared/domain/Account.model";

export class AccountService {
    constructor(
        private accountRepositoryFactory: (db: Kysely<DB>) => AccountRepository,
        private db: Kysely<DB>,
    ) {
    }

    async createAccount(account: CreateAccount): Promise<Account | undefined> {
        return this.accountRepositoryFactory(this.db).createAccount(account);
    }

    async getOrCreateAccount(
        createAccount: CreateAccount,
    ): Promise<Account | undefined> {
        return await this.db.transaction().execute(async (tx) => {
            const accountRepository = this.accountRepositoryFactory(tx);
            const account = await accountRepository.findAccountByEmail(createAccount.email);
            if (account) return account;
            return await accountRepository.createAccount(createAccount);
        });
    }

    async verifyPassword(
        email: string,
        password: string,
    ): Promise<Account | undefined> {
        return this.db.transaction().execute(async (tx) => {
            const account = await this.accountRepositoryFactory(
                this.db,
            ).findAccountByEmail(email);
            if (account) {
                if (!account.passwordHash || password.length === 0) return undefined;
                if (await argon2.verify(account.passwordHash, password)) {
                    return {
                        ...account,
                        passwordHash: "",
                    };
                }
                return undefined;
            }
            return undefined;
        });
    }
}

export namespace AccountService {
    export const type = Symbol.for("AccountService");
}
