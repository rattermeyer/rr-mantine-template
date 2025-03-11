import type {Kysely} from 'kysely';
import type {DB} from '~/shared/infrastructure/db/model/kysely/tables';
import type {CustomerRepository} from '~/pages/CustomerListPage/domain/Customer.repository';
import {inject, injectable, LazyServiceIdentifer, LazyServiceIdentifier} from 'inversify';
import {kyselySymbol} from '~/InversifyConfig.server';
import type {InvoiceRepository} from '~/shared/domain/InvoiceRepository';

@injectable()
export class CustomerService {
    constructor(
        @inject(new LazyServiceIdentifer(() => 'Factory<CustomerRepository>')) private customerRepositoryFactory: (db: Kysely<DB>) => CustomerRepository,
        @inject(new LazyServiceIdentifier( () => 'Factory<InvoiceRepository>')) private invoiceRepositoryFactory: (db: Kysely<DB>) => InvoiceRepository,
        @inject(new LazyServiceIdentifier( () => kyselySymbol)) private db: Kysely<DB>) {
    }

    async deleteCustomer(customerId: number): Promise<void> {
        await this.db.transaction().execute(async (tx) => {
            const customerRepository = this.customerRepositoryFactory(tx);
            const invoiceRepository = this.invoiceRepositoryFactory(tx);
            await invoiceRepository.deleteInvoiceByCustomerId(customerId);
            await customerRepository.deleteByCustomerId(customerId);
        })
    }
}

