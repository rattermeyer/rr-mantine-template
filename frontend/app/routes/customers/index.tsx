import { container } from "~/inversify-config.server";
import { CustomerService } from "~/modules/customer/domain/customer-service";
import { CustomerListPage } from "~/modules/customer/ui/customer-list-page";
import { authenticate } from "~/shared/services/auth.server";
import type { Route } from "./+types/index";

const customerService = container.get<CustomerService>(CustomerService.type);

export async function loader({ request }: Route.LoaderArgs) {
	await authenticate(request, "/customers");
	const customers = await customerService.loadCustomers();
	return { customers };
}

export default function CustomerList({ loaderData }: Route.ComponentProps) {
	const { customers } = loaderData;
	return <CustomerListPage customers={customers} />;
}
