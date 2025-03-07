import { Container, type interfaces } from "inversify";
import type { Kysely } from "kysely";
import { AccountRepository } from "~/pages/AuthenticationForm/domain/Account.repository";
import { AccountService } from "~/pages/AuthenticationForm/domain/Account.service";
import { AccountRepositoryImpl } from "~/pages/AuthenticationForm/infrastructure/AccountRepositoryImpl";
import { kyselyBuilder } from "~/shared/infrastructure/db/db.server";
import type { DB } from "./shared/infrastructure/db/model/kysely/database";

export const container = new Container();

export const kyselySymbol = Symbol.for("kysely");
container.bind<Kysely<DB>>(kyselySymbol).toConstantValue(kyselyBuilder());

container
	.bind<interfaces.Factory<AccountRepository>>("Factory<AccountRepository>")
	.toFactory<AccountRepository, [Kysely<DB>]>(
		(context) => (db: Kysely<DB>) => new AccountRepositoryImpl(db),
	);

container
	.bind<AccountRepository>(AccountRepository.type)
	.to(AccountRepositoryImpl);

container
	.bind<AccountService>(AccountService.type)
	.toDynamicValue(
		(): AccountService =>
			new AccountService(
				container.get("Factory<AccountRepository>"),
				container.get(kyselySymbol),
			),
	);
