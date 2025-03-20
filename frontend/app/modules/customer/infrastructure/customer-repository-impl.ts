import type {Kysely} from "kysely";
import type {CustomerRepository} from "~/modules/customer/domain/customer.repository";
import type {CreateCustomer, Customer} from "~/shared/domain/customer.model";
import {kyselyBuilder} from "~/shared/infrastructure/db/db.server";
import type {DB} from "~/shared/infrastructure/db/model/kysely/tables";
import {filterNonNullAttributes} from "~/shared/object-handler";

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
        const result = await this.kysely
            .selectFrom("customer")
            .selectAll()
            .orderBy("lastName asc")
            .execute();
        return result.map((customer) => {
            return {
                ...customer,
                company: customer.company || "",
                address: customer.address || "",
                city: customer.city || "",
                state: customer.state || "",
                country: customer.country || "",
                postalCode: customer.postalCode || "",
                phone: customer.phone || "",
                fax: customer.fax || "",
            }
        });
    }

    async findCustomerById(customerId: number): Promise<Customer | undefined> {
        const result = await this.kysely
            .selectFrom("customer")
            .where("customerId", "=", customerId)
            .selectAll()
            .executeTakeFirstOrThrow();
        return {
            ...result,
            company: result.company || "",
            address: result.address || "",
            city: result.city || "",
            state: result.state || "",
            country: result.country || "",
            postalCode: result.postalCode || "",
            phone: result.phone || "",
            fax: result.fax || "",
        }
    }

    async updateCustomer(customer: Customer): Promise<Customer | undefined> {
        const nonNullData = filterNonNullAttributes(customer);
        const result = await this.kysely
            .updateTable("customer")
            .set(nonNullData)
            .where("customerId", "=", customer.customerId)
            .returningAll()
            .executeTakeFirstOrThrow();
        return {
            ...result,
            company: result.company || "",
            address: result.address || "",
            city: result.city || "",
            state: result.state || "",
            country: result.country || "",
            postalCode: result.postalCode || "",
            phone: result.phone || "",
            fax: result.fax || "",
        }
    };

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
        return {
            ...result,
            company: result.company || "",
            address: result.address || "",
            city: result.city || "",
            state: result.state || "",
            country: result.country || "",
            postalCode: result.postalCode || "",
            phone: result.phone || "",
            fax: result.fax || "",
        }
    }
}
