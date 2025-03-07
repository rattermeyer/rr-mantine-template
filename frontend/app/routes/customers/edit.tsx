import {zodResolver} from '@hookform/resolvers/zod';
import {Input, Stack} from '@mantine/core';
import {Form} from 'react-router';
import {useRemixForm} from 'remix-hook-form';
import type {z} from 'zod';
import {kyselyBuilder} from '~/shared/infrastructure/db/db.server';
import type {Customer} from '~/shared/infrastructure/db/model/kysely/entities';
import {customerMutator} from '~/shared/infrastructure/db/model/zod';
import type {Route} from "./+types/edit";

type UpdatableCustomer = z.infer<typeof customerMutator>;

const resolver = zodResolver(customerMutator);

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

export default function EditCustomer({loaderData}: Route.ComponentProps) {
    const {customer} = loaderData;
    const {register, handleSubmit, formState: {errors}} = useRemixForm<UpdatableCustomer>({
        resolver,
        defaultValues: customer,
    });
    return (
        <div>
            Edit customer <pre>{JSON.stringify(customer, null, 2)}</pre>
            <Form onSubmit={handleSubmit}>
                <Stack gap="md">
                    <Input {...register('firstName')} />
                    <Input {...register('lastName')} />
                    <Input {...register('company')} />
                    <Input {...register('address')} />
                    <Input {...register('city')} />
                    <Input {...register('state')} />
                    <Input {...register('country')} />
                    <Input {...register('postalCode')} />

                </Stack>
            </Form>
        </div>
    )
}
