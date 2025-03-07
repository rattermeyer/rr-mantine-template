import {injectable} from "inversify";
import type {Kysely} from "kysely";
import type {AccountRepository} from "~/pages/AuthenticationForm/domain/Account.repository";
import type {Account as DomainAccount} from "~/shared/domain/Account.model";
import {kyselyBuilder} from "~/shared/infrastructure/db/db.server";
import type {DB} from "~/shared/infrastructure/db/model/kysely/database";
import type {NewAccount} from '~/shared/infrastructure/db/model/kysely';

@injectable()
export class AccountRepositoryImpl implements AccountRepository {
    private db: Kysely<DB>;

    constructor(db?: Kysely<DB>) {
        this.db = db || kyselyBuilder();
    }

    async createAccount(account: NewAccount): Promise<DomainAccount | undefined> {
        const result = await this.db
            .insertInto("account")
            .values(
                {
                    ...account,
                    passwordHash: "",
                    preferences: {},
                }
            )
            .returningAll()
            .executeTakeFirst();
        if (!result) return undefined;
        return result;
    }

    async findAccountByEmail(email: string): Promise<DomainAccount | undefined> {
        return await this.unique(
            await this.db
                .selectFrom("account")
                .where("email", "=", email)
                .limit(1)
                .selectAll()
                .execute(),
        );
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
