import type {CreateCustomer, Customer} from '~/shared/domain/Customer.model';

export interface CustomerRepository {
    loadCustomers(): Promise<Customer[]>;
    findCustomerById(customerId: number): Promise<Customer | undefined>;
    updateCustomer(customer: Customer): Promise<Customer | undefined>;
    deleteByCustomerId(customerId: number): Promise<void>;
    createCustomer(customer: CreateCustomer): Promise<Customer>;
}

export namespace CustomerRepository {
    export const type = Symbol.for('CustomerRepository');
}
