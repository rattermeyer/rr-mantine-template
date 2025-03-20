import type { Kysely } from "kysely";
import type { InvoiceRepository } from "~/shared/domain/invoice-repository";
import type { DB } from "~/shared/infrastructure/db/model/kysely/tables";

export class InvoiceRepositoryImpl implements InvoiceRepository {
	constructor(private db: Kysely<DB>) {}

	async deleteInvoiceByCustomerId(customerId: number): Promise<void> {
		const invoices = await this.db
			.selectFrom("invoice")
			.where("customerId", "=", customerId)
			.select("invoiceId")
			.execute();
		if (invoices?.length > 0 && invoices[0].invoiceId) {
			await this.db
				.deleteFrom("invoiceLine")
				.where("invoiceId", "in", [...invoices.flatMap((v) => v.invoiceId)])
				.execute();
			await this.db
				.deleteFrom("invoice")
				.where("customerId", "=", customerId)
				.execute();
		}
	}
}
