import type { Kysely } from "kysely";
import type { CustomerRepository } from "~/modules/customer/domain/customer.repository";
import {
	type CreateCustomer,
	type Customer,
	updateCustomer,
} from "~/shared/domain/customer.model";
import { kyselyBuilder } from "~/shared/infrastructure/db/db.server";
import type { NullableCustomerEntity } from "~/shared/infrastructure/db/model/kysely/entities";
import type { DB } from "~/shared/infrastructure/db/model/kysely/tables";
import { filterNonNullAttributes } from "~/shared/object-handler";
import {logger} from '~/shared/services/logging.server';

export class CustomerRepositoryImpl implements CustomerRepository {
	private kysely: Kysely<DB>;

	constructor(kysely?: Kysely<DB>) {
		if (kysely) {
			this.kysely = kysely;
		} else {
			this.kysely = kyselyBuilder();
		}
	}

	async loadCustomers(): Promise<Customer[]> {
		const result = this.kysely
			.selectFrom("customer")
			.selectAll()
			.orderBy("lastName asc")
			.execute();
		return result;
	}

	async findCustomerById(customerId: number): Promise<Customer | undefined> {
		const result = await this.kysely
			.selectFrom("customer")
			.where("customerId", "=", customerId)
			.selectAll()
			.executeTakeFirstOrThrow();
		return this.nullSafe(result);
	}

	async updateCustomer(customer: Customer): Promise<Customer | undefined> {
		const nonNullData = filterNonNullAttributes(customer);
		const result = await this.kysely
			.updateTable("customer")
			.set(nonNullData)
			.where("customerId", "=", customer.customerId)
			.returningAll()
			.executeTakeFirstOrThrow();
		return this.nullSafe(result);
	}

	async deleteByCustomerId(customerId: number): Promise<void> {
		await this.kysely
			.deleteFrom("customer")
			.where("customerId", "=", customerId)
			.execute();
	}

	async createCustomer(customer: CreateCustomer): Promise<Customer> {
		const result = await this.kysely
			.insertInto("customer")
			.values(customer)
			.returningAll()
			.executeTakeFirstOrThrow();
		return this.nullSafe(result);
	}

	private nullSafe(customer: NullableCustomerEntity): Customer {
		try {
			return updateCustomer.parse(customer);
		} catch (e) {
			logger.error("Error parsing customer", customer, e);
			throw e;
		}
	}
}
