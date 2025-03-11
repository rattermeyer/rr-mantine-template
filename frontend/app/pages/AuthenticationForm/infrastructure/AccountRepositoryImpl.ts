import {injectable} from "inversify";
import type {Kysely} from "kysely";
import type {AccountRepository} from "~/pages/AuthenticationForm/domain/Account.repository";
import type {Account as DomainAccount, CreateAccount, PreferenceEntry} from "~/shared/domain/Account.model";
import {kyselyBuilder} from "~/shared/infrastructure/db/db.server";
import type {DB} from "~/shared/infrastructure/db/model/kysely/tables";
import type {NewAccount} from '~/shared/infrastructure/db/model/kysely/entities';

@injectable()
export class AccountRepositoryImpl implements AccountRepository {
    private db: Kysely<DB>;

    constructor(db?: Kysely<DB>) {
        this.db = db || kyselyBuilder();
    }

    async updatePreference(accountUuid: string, category: string, key: string, value: string): Promise<void> {
        await this.db.insertInto('preferences')
            .values({accountUuid, category, key, value})
            .onConflict((oc) =>
                oc.columns(['accountUuid', 'category', 'key'])
                    .doUpdateSet({value})).execute()
    }

    async findPreferencesByUuid(accountUuid: string, category?: string, key?: string): Promise<PreferenceEntry[] | undefined> {
        if (key && !category) throw new Error('Category must be provided when key is provided')
        let query =
            this.db.with('ap', (db) =>
                db.selectFrom('preferences')
                    .where('accountUuid', '=', accountUuid)
                    .select(['category', 'key', 'value']))
                .with('dp', (db) =>
                    db.selectFrom('preferences')
                        .where('accountUuid', 'is', null)
                        .select(['category', 'key', 'value']))
                .selectFrom('dp')
                .leftJoin('ap', (join) =>
                    join.onRef('ap.key', '=', 'dp.key')
                        .onRef('ap.category', '=', 'dp.category'))
                .select((s) =>
                    [s.fn.coalesce('ap.value', 'dp.value').as('value'),
                        s.fn.coalesce('ap.key', 'dp.key').as('key'),
                        s.fn.coalesce('ap.category', 'dp.category').as('category')])

        if (category && key) {
            query = query.where(({eb, and}) =>
                and([eb('dp.category', '=', category), eb('dp.key', '=', key)]))
        }
        console.log(query.compile())
        return query.execute()
    }

    async createAccount(account: CreateAccount): Promise<DomainAccount | undefined> {
        const newAccount: NewAccount = {
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
        const preferences = await this.findPreferencesByUuid(account.uuid) || [];
        const result: DomainAccount = {
            ...account,
            uuid: account.uuid || '', passwordHash: "", roles: [],
            preferences: preferences
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
