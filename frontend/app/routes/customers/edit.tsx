import {zodResolver} from '@hookform/resolvers/zod';
import {data, Form} from 'react-router';
import {getValidatedFormData, RemixFormProvider, useRemixForm} from 'remix-hook-form';
import {kyselyBuilder} from '~/shared/infrastructure/db/db.server';
import type {Route} from "./+types/edit";
import {type Customer, type UpdateCustomer, updateCustomer} from '~/shared/domain/Customer.model';
import {filterNonNullAttributes} from '~/shared/ObjectHandler';
import {CustomerForm} from '~/pages/CustomerListPage/ui/CustomerForm';

const resolver = zodResolver(updateCustomer);

export async function loader({request, params}: Route.LoaderArgs) {
    const {id = '0'} = params;
    const kysely = kyselyBuilder();
    const result = await kysely.selectFrom('customer')
        .where('customerId', '=', Number.parseInt(id))
        .selectAll()
        .limit(1).execute();
    if (result && result.length > 0) {
        return {customer: result[0] as Customer};
    }
    return {customer: {} as Customer};
}

export async function action({request, params}: Route.ActionArgs) {
    const {errors, data: resolvedData, receivedValues: defaultValues} = await getValidatedFormData(request, resolver);
    if (errors) {
        return data({errors, defaultValues}, {status: 400});
    }
    console.log('resolvedData', resolvedData);
    const nonNullData = filterNonNullAttributes(resolvedData);
    console.log('nonNullData', nonNullData);
    await kyselyBuilder().updateTable('customer').set(nonNullData).where('customerId', '=', resolvedData.customerId).returningAll().execute();
}

export default function EditCustomer({loaderData}: Route.ComponentProps) {
    const {customer} = loaderData;
    const form = useRemixForm<UpdateCustomer>
    ({
        resolver,
        defaultValues: customer,
        mode: 'onSubmit',
        reValidateMode: 'onBlur'
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
    )
}
