import type {Route} from "./+types/new";
import {getValidatedFormData, useRemixForm} from 'remix-hook-form';
import {createCustomer, type CreateCustomer, type Customer} from '~/shared/domain/Customer.model';
import {zodResolver} from '@hookform/resolvers/zod';
import {Button, Flex, SimpleGrid, Stack, TextInput} from '@mantine/core';
import {Form, data, redirect} from 'react-router';
import {TbDeviceFloppy} from 'react-icons/tb';
import {container} from '~/InversifyConfig.server';
import type {CustomerRepository} from '~/pages/CustomerListPage/domain/Customer.repository';
import type {DB} from '~/shared/infrastructure/db/model/kysely/tables';
import type {Kysely} from 'kysely';
import {authenticate} from '~/shared/services/auth.server';

const resolver = zodResolver(createCustomer)
const customerRepository: CustomerRepository = container.get<(db?: Kysely<DB>) => CustomerRepository>("Factory<CustomerRepository>")()

export async function loader({request}: Route.LoaderArgs) {
    await authenticate(request, '/customers/new')
}

export async function action({request}: Route.ActionArgs) {
    await authenticate(request)
    const {errors, receivedValues: defaultValues, data: formData} = await getValidatedFormData(request, resolver);
    if (errors) {
        return data({errors, defaultValues: data}, {status: 400});
    }
    const customer : Customer = await customerRepository.createCustomer(formData)
    return redirect('/customers')
}

export default function NewCustomer({loaderData}: Route.ComponentProps) {
    const {handleSubmit, formState: {errors}, register} = useRemixForm<CreateCustomer>({
        resolver
    })
    return (
        <div>
            <Form onSubmit={handleSubmit} method={"post"}>
                <Stack gap={"md"}>
                    <SimpleGrid cols={2}>
                        <TextInput label={"First Name"} {...register('firstName')} error={errors.firstName?.message}/>
                        <TextInput label={"Last Name"} {...register('lastName')} error={errors.lastName?.message}/>
                        <TextInput label={"Email"} {...register('email')} error={errors.email?.message}/>
                    </SimpleGrid>
                    <Flex><Button type={"submit"} leftSection={<TbDeviceFloppy size={20}/>}>Create</Button></Flex>
                </Stack>
            </Form>
        </div>
    )
}
