import {
	LazyServiceIdentifer,
	LazyServiceIdentifier,
	inject,
	injectable,
} from "inversify";
import type { Kysely } from "kysely";
import { kyselySymbol } from "~/inversify-config.server";
import type { CustomerService } from "~/modules/customer/domain/customer-service";
import { _CustomerServiceImpl } from "~/modules/customer/domain/customer-service-impl";
import type { CustomerRepository } from "~/modules/customer/domain/customer.repository";
import type { Customer } from "~/shared/domain/customer.model";
import type { InvoiceRepository } from "~/shared/domain/invoice-repository";
import type { DB } from "~/shared/infrastructure/db/model/kysely/tables";

@injectable()
export class TxCustomerServiceImpl implements CustomerService {
	constructor(
		@inject(new LazyServiceIdentifer(() => "Factory<CustomerRepository>"))
		private customerRepositoryFactory: (db: Kysely<DB>) => CustomerRepository,
		@inject(new LazyServiceIdentifier(() => "Factory<InvoiceRepository>"))
		private invoiceRepositoryFactory: (db: Kysely<DB>) => InvoiceRepository,
		@inject(new LazyServiceIdentifier(() => kyselySymbol))
		private db: Kysely<DB>,
	) {}

	findCustomerById(customerId: number): Promise<Customer | undefined> {
		return this.db.transaction().execute(async (tx) => {
			const customerRepository = this.customerRepositoryFactory(tx);
			return customerRepository.findCustomerById(customerId);
		});
	}

	updateCustomer(customer: Customer): Promise<Customer> {
		return this.db.transaction().execute(async (tx) => {
			const customerRepository = this.customerRepositoryFactory(tx);
			const customerService = new _CustomerServiceImpl(customerRepository);
			return await customerService.updateCustomer(customer);
		});
	}

	async loadCustomers(): Promise<Customer[]> {
		return this.db.transaction().execute(async (tx) => {
			const customerRepository = this.customerRepositoryFactory(tx);
			const customerService = new _CustomerServiceImpl(customerRepository);
			return customerService.loadCustomers();
		});
	}

	async deleteCustomer(customerId: number): Promise<void> {
		await this.db.transaction().execute(async (tx) => {
			const customerRepository = this.customerRepositoryFactory(tx);
			const invoiceRepository = this.invoiceRepositoryFactory(tx);
			const customerService = new _CustomerServiceImpl(
				customerRepository,
				invoiceRepository,
			);
			await customerService.deleteCustomer(customerId);
		});
	}
}
