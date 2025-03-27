import type { CustomerService } from "~/modules/customer/domain/customer-service";
import type { CustomerRepository } from "~/modules/customer/domain/customer.repository";
import type { Customer } from "~/shared/domain/customer.model";
import type { InvoiceRepository } from "~/shared/domain/invoice-repository";

/**
 * This class is used to implement the business logic for the customer service.
 * It is not directly used, because the Service should be transactional.
 */
export class _CustomerServiceImpl implements CustomerService {
	constructor(
		private customerRepository: CustomerRepository,
		private invoiceRepository?: InvoiceRepository,
	) {}

	findCustomerById(customerId: number): Promise<Customer | undefined> {
		return this.customerRepository.findCustomerById(customerId);
	}

	async deleteCustomer(customerId: number): Promise<void> {
		if (!this.invoiceRepository)
			throw new Error("Invoice repository is not defined");
		await this.invoiceRepository.deleteInvoiceByCustomerId(customerId);
		await this.customerRepository.deleteByCustomerId(customerId);
	}

	async loadCustomers(): Promise<Customer[]> {
		return this.customerRepository.loadCustomers();
	}

	async updateCustomer(customer: Customer): Promise<Customer> {
		const result = await this.customerRepository.updateCustomer(customer);
		if (!result) throw new Error("Customer not found");
		return result;
	}
}
