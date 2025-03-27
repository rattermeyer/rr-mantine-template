import { redirect } from "react-router";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { container } from "~/inversify-config.server";
import { CustomerService } from "~/modules/customer/domain/customer-service";
import { authenticate } from "~/shared/services/auth.server";
import type { Route } from "./+types/delete";

const schema = zfd.formData({ id: z.string() });
const service = container.get<CustomerService>(CustomerService.type);

export async function action({ request, params }: Route.ActionArgs) {
	await authenticate(request);
	const { id } = schema.parse(await request.formData());
	console.log(`delete customer with id ${id}`);
	await service.deleteCustomer(Number.parseInt(id));
	return redirect("/customers");
}
