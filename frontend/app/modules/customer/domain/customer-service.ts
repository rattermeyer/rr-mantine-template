import type {Customer} from '~/shared/domain/customer.model';

export interface CustomerService {
    deleteCustomer(customerId: number): Promise<void>;
    loadCustomers(): Promise<Customer[]>;
    findCustomerById(customerId: number): Promise<Customer | undefined>;
    updateCustomer(customer: Customer): Promise<Customer>;
}

export namespace CustomerService {
    export const type = Symbol.for("CustomerService");
}
