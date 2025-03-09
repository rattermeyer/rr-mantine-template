import {injectable} from "inversify";
import type {Kysely} from "kysely";
import type {AccountRepository} from "~/pages/AuthenticationForm/domain/Account.repository";
import type {Account as DomainAccount, CreateAccount} from "~/shared/domain/Account.model";
import {kyselyBuilder} from "~/shared/infrastructure/db/db.server";
import type {DB} from "~/shared/infrastructure/db/model/kysely/tables";
import {type JsonObject, jsonToRecord} from '~/shared/domain/JsonTypes';
import type {NewAccount} from '~/shared/infrastructure/db/model/kysely/entities';

@injectable()
export class AccountRepositoryImpl implements AccountRepository {
    private db: Kysely<DB>;

    constructor(db?: Kysely<DB>) {
        this.db = db || kyselyBuilder();
    }

    async createAccount(account: CreateAccount): Promise<DomainAccount | undefined> {
        const newAccount : NewAccount = {
            email: account.email,
            passwordHash: account.passwordHash || "",
            preferences: account.preferences || {},
            name: account.name,
        };
        const result = await this.db
            .insertInto("account")
            .values(
                newAccount
            )
            .returningAll()
            .executeTakeFirst();
        if (!result) return undefined;
        return result as DomainAccount;
    }

    async findAccountByEmail(email: string): Promise<DomainAccount | undefined> {
        const account = await this.unique(
            await this.db
                .selectFrom("account")
                .where("email", "=", email)
                .limit(1)
                .selectAll()
                .execute(),
        );
        if (!account) return undefined;
        const result: DomainAccount = {
            ...account,
            uuid: account.uuid || '', passwordHash: "", roles: [],
            preferences: jsonToRecord(account.preferences as JsonObject)
        };
        return result;
    }

    async unique<T>(result: T[]): Promise<T | undefined> {
        if (result.length > 1) {
            throw new Error("Multiple results found");
        }
        if (result.length === 1) {
            return result[0];
        }
        return undefined;
    }

    async findAccountByUuid(uuid: string): Promise<DomainAccount | undefined> {
        throw new Error("Method not implemented.");
    }
}
