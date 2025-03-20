import type { Kysely } from "kysely";
import { type BookType, utils, write } from "xlsx";
import { container } from "~/inversify-config.server";
import type { CustomerRepository } from "~/modules/customer/domain/customer.repository";
import type { DB } from "~/shared/infrastructure/db/model/kysely/tables";
import { authenticate } from "~/shared/services/auth.server";
import type { Route } from "./+types/export";

const repository = container.get<(kysely?: Kysely<DB>) => CustomerRepository>(
	"Factory<CustomerRepository>",
)();

/**
 * This is a resource route that exports all customers to a file.
 * @param request
 * @queryParam format - the format of the file to export.
 */
export async function loader({ request }: Route.LoaderArgs) {
	await authenticate(request);
	const { searchParams } = new URL(request.url);
	const format = searchParams.get("format") ?? "csv";
	const customers = await repository.loadCustomers();
	const worksheet = utils.json_to_sheet(customers);
	const workbook = utils.book_new();
	utils.book_append_sheet(workbook, worksheet, "Customers");
	const fileData = write(workbook, {
		type: "binary",
		bookType: format as BookType,
		sheet: "Customers",
	});
	// and transform it to a Buffer to send in the Response
	const buffer = Buffer.from(fileData, "binary");

	return new Response(buffer, {
		status: 200,
		headers: {
			"Content-Type": "application/octet-stream",
			"Content-Disposition": `attachment; filename="customers.${format}"`,
		},
	});
}
