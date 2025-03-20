import {container} from "~/inversify-config.server";
import {CustomerListPage} from "~/modules/customer/ui/customer-list-page";
import {authenticate} from "~/shared/services/auth.server";
import type {Route} from "./+types/index";
import {Suspense} from 'react';
import {Await} from 'react-router';
import {CustomerService} from '~/modules/customer/domain/customer-service';

const customerService = container.get<CustomerService>(CustomerService.type);

export async function loader({request}: Route.LoaderArgs) {
    await authenticate(request, "/customers");
    const customers = customerService.loadCustomers();
    return {customers};
}

export default function CustomerList({loaderData}: Route.ComponentProps) {
    const {customers} = loaderData;
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Await resolve={customers}>
                {value => <CustomerListPage customers={value}/>}
            </Await>
        </Suspense>
    )
}
