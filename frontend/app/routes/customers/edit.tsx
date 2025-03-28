import { zodResolver } from "@hookform/resolvers/zod";
import { Form, data, redirect } from "react-router";
import {
	RemixFormProvider,
	getValidatedFormData,
	useRemixForm,
} from "remix-hook-form";
import { container } from "~/inversify-config.server";
import { CustomerService } from "~/modules/customer/domain/customer-service";
import {
	CustomerForm,
} from "~/modules/customer/ui/customer-form";
import {type Customer, type UpdateCustomer, updateCustomer} from "~/shared/domain/customer.model";
import { filterNonNullAttributes } from "~/shared/object-handler";
import { authenticate } from "~/shared/services/auth.server";
import type { Route } from "./+types/edit";

const resolver = zodResolver(updateCustomer);

const customerService = container.get<CustomerService>(CustomerService.type);

export async function loader({ request, params }: Route.LoaderArgs) {
	const { id = "0" } = params;
	await authenticate(request, `/customers/edit/${id}`);
	const customer: Customer | undefined = await customerService.findCustomerById(
		Number.parseInt(id),
	);
	if (!customer) return new Response("Customer not found", { status: 404 });
	return { customer };
}

export async function action({ request, params }: Route.ActionArgs) {
	await authenticate(request);
	const {
		errors,
		data: resolvedData,
		receivedValues: defaultValues,
	} = await getValidatedFormData(request, resolver);
	if (errors) {
		console.log("errors", errors);
		return data({ errors, defaultValues }, { status: 400 });
	}
	await customerService.updateCustomer(resolvedData);
}

export default function EditCustomer({ loaderData }: Route.ComponentProps) {
	const { customer } = loaderData;
	const form = useRemixForm<UpdateCustomer>({
		resolver,
		defaultValues: customer,
		mode: "onSubmit",
		reValidateMode: "onBlur",
	});
	const { handleSubmit } = form;
	return (
		<div>
			<RemixFormProvider {...form}>
				<Form onSubmit={handleSubmit} method={"post"}>
					<CustomerForm editable={true} />
				</Form>
			</RemixFormProvider>
		</div>
	);
}
