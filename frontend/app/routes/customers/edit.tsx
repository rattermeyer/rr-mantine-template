import {zodResolver} from "@hookform/resolvers/zod";
import {data, Form, redirect} from "react-router";
import {getValidatedFormData, RemixFormProvider, useRemixForm,} from "remix-hook-form";
import {CustomerForm, type UpdateCustomerForm, updateCustomerForm} from "~/modules/customer/ui/customer-form";
import {filterNonNullAttributes} from "~/shared/object-handler";
import {authenticate} from "~/shared/services/auth.server";
import type {Route} from "./+types/edit";
import {container} from '~/inversify-config.server';
import {CustomerService} from '~/modules/customer/domain/customer-service';
import type {Customer} from '~/shared/domain/customer.model';

const resolver = zodResolver(updateCustomerForm);

const customerService = container.get<CustomerService>(CustomerService.type);

export async function loader({request, params}: Route.LoaderArgs) {
    const {id = "0"} = params;
    await authenticate(request, `/customers/edit/${id}`);
    const customer: Customer | undefined = await customerService.findCustomerById(Number.parseInt(id))
    if (!customer) return new Response("Customer not found", {status: 404});
    return {customer}

}

export async function action({request, params}: Route.ActionArgs) {
    await authenticate(request);
    const {
        errors,
        data: resolvedData,
        receivedValues: defaultValues,
    } = await getValidatedFormData(request, resolver);
    if (errors) {
        console.log("errors", errors);
        return data({errors, defaultValues}, {status: 400});
    }
    if (resolvedData.action === "back") {
        console.log("back");
        return redirect("/customers");
    }
    const nonNullData = filterNonNullAttributes(resolvedData);
    const {action, ...customer} = resolvedData;
    await customerService.updateCustomer({
        customerId: customer.customerId || 0,
        firstName: customer.firstName || "",
        lastName: customer.lastName || "",
        email: customer.email || "",
        phone: customer.phone || "",
        address: customer.address || "",
        country: customer.country || "",
        postalCode: customer.postalCode || "",
        fax: customer.fax || "",
        company: customer.company || "",
        city: customer.city || "",
        state: customer.state || "",
    });
}

export default function EditCustomer({loaderData}: Route.ComponentProps) {
    const {customer} = loaderData;
    const form = useRemixForm<UpdateCustomerForm>({
        resolver,
        defaultValues: customer,
        mode: "onSubmit",
        reValidateMode: "onBlur",
    });
    const {handleSubmit} = form;
    return (
        <div>
            <RemixFormProvider {...form}>
                <Form onSubmit={handleSubmit} method={"post"}>
                    <CustomerForm editable={true}/>
                </Form>
            </RemixFormProvider>
        </div>
    );
}
