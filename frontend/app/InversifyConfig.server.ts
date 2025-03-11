import {Container, type interfaces} from "inversify";
import type {Kysely} from "kysely";
import {AccountRepository} from "~/pages/AuthenticationForm/domain/Account.repository";
import {AccountService} from "~/pages/AuthenticationForm/domain/Account.service";
import {AccountRepositoryImpl} from "~/pages/AuthenticationForm/infrastructure/AccountRepositoryImpl";
import {kyselyBuilder} from "~/shared/infrastructure/db/db.server";
import type {DB} from "./shared/infrastructure/db/model/kysely/tables";
import type {CustomerRepository} from '~/pages/CustomerListPage/domain/Customer.repository';
import {CustomerRepositoryImpl} from '~/pages/CustomerListPage/infrastructure/CustomerRepositoryImpl';
import type {InvoiceRepository} from "./shared/domain/InvoiceRepository";
import {InvoiceRepositoryImpl} from '~/shared/infrastructure/db/InvoiceRepositoryImpl';
import {CustomerService} from '~/shared/domain/CustomerService';

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

container.bind<interfaces.Factory<CustomerRepository>>("Factory<CustomerRepository>")
    .toFactory <CustomerRepository, [Kysely<DB>]>(
        (context: interfaces.Context) =>
            (kysely?: Kysely<DB>) => {
                const db: Kysely<DB> = kysely ? kysely : container.get<Kysely<DB>>(kyselySymbol);
                return new CustomerRepositoryImpl(kysely)
            });

container.bind<interfaces.Factory<InvoiceRepository>>("Factory<InvoiceRepository>").toFactory<InvoiceRepository, [Kysely<DB>]>(
    (context: interfaces.Context) => (kysely?: Kysely<DB>) => {
        const db: Kysely<DB> = kysely ? kysely : container.get<Kysely<DB>>(kyselySymbol);
        return new InvoiceRepositoryImpl(db)
    });

container.bind<CustomerService>(CustomerService).toSelf();
