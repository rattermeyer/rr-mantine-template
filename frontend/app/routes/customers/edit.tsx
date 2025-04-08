import {zodResolver} from "@hookform/resolvers/zod";
import {data, Form} from "react-router";
import {getValidatedFormData, RemixFormProvider, useRemixForm,} from "remix-hook-form";
import {container} from "~/inversify-config.server";
import {CustomerService} from "~/modules/customer/domain/customer-service";
import {CustomerForm,} from "~/modules/customer/ui/customer-form";
import {type Customer, type UpdateCustomer, updateCustomer} from "~/shared/domain/customer.model";
import {authenticate} from "~/shared/services/auth.server";
import type {Route} from "./+types/edit";
import {logger} from '~/shared/services/logging.server';
import {useEffect, useTransition} from 'react';

const resolver = zodResolver(updateCustomer);

const customerService = container.get<CustomerService>(CustomerService.type);

export async function loader({request, params}: Route.LoaderArgs) {
    const {id = "0"} = params;
    await authenticate(request, `/customers/edit/${id}`);
    const customer: Customer | undefined = await customerService.findCustomerById(
        Number.parseInt(id),
    );
    if (!customer) return new Response("Customer not found", {status: 404});
    return {customer};
}

export async function action({request, params}: Route.ActionArgs) {
    await authenticate(request);
    const {
        errors,
        data: resolvedData,
        receivedValues: defaultValues,
    } = await getValidatedFormData(request, resolver);
    if (errors) {
        logger.warn("errors", errors);
        return data({errors, defaultValues}, {status: 400});
    }
    return await customerService.updateCustomer(resolvedData);

}

export default function EditCustomer({loaderData, actionData}: Route.ComponentProps) {
    const {customer} = loaderData;
    logger.debug("actionData", actionData);
    const form = useRemixForm<UpdateCustomer>({
        resolver,
        defaultValues: customer,
        mode: "onSubmit",
        reValidateMode: "onBlur",
    });


    const {handleSubmit, formState: {isSubmitting}} = form;
    // reset the form, when submit is finished.
    // we do not show a toast
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        form.reset({...customer});
    }, [customer, isSubmitting]);
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
