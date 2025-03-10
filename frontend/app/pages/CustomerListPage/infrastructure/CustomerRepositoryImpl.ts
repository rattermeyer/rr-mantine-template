import type {CustomerRepository} from '~/pages/CustomerListPage/domain/Customer.repository';
import type {CreateCustomer, Customer} from '~/shared/domain/Customer.model';
import type {Kysely} from 'kysely';
import type {DB} from '~/shared/infrastructure/db/model/kysely/tables';
import {kyselyBuilder} from '~/shared/infrastructure/db/db.server';
import {filterNonNullAttributes} from '~/shared/ObjectHandler';

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
        return await this.kysely.selectFrom('customer').selectAll().orderBy('lastName asc').execute();
    }

    async findCustomerById(customerId: number): Promise<Customer | undefined> {
        const result = await this.kysely.selectFrom('customer')
            .where('customerId', '=', customerId)
            .selectAll()
            .limit(1).execute()
        if (result && result.length > 0) {
            return result[0] as Customer;
        }
        return {} as Customer;
    }

    async updateCustomer(customer: Customer): Promise<Customer | undefined> {
        const nonNullData = filterNonNullAttributes(customer);
        return await this.kysely.updateTable('customer')
            .set(nonNullData).where('customerId', '=', customer.customerId)
            .returningAll().executeTakeFirst();
    }

    async deleteByCustomerId(customerId: number): Promise<void> {
        await this.kysely.deleteFrom('customer').where('customerId', '=', customerId).execute();
    }

    async createCustomer(customer: CreateCustomer): Promise<Customer> {
        return await this.kysely.insertInto('customer').values(customer).returningAll().executeTakeFirstOrThrow();
    }
}
