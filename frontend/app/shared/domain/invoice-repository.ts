export interface InvoiceRepository {
	deleteInvoiceByCustomerId(customerId: number): Promise<void>;
}

namespace InvoiceRegistry {
	export const type = Symbol.for("InvoiceRepository");
}
