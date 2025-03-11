import type {Route} from "./+types/index"
import {CustomerListPage} from '~/pages/CustomerListPage/CustomerListPage';
import {container} from '~/InversifyConfig.server';
import type {CustomerRepository} from '~/pages/CustomerListPage/domain/Customer.repository';
import type {DB} from '~/shared/infrastructure/db/model/kysely/tables';
import type {Kysely} from 'kysely';
import {authenticate} from '~/shared/services/auth.server';

const repository = container.get<(kysely?: Kysely<DB>) => CustomerRepository>("Factory<CustomerRepository>")();

export async function loader({request}: Route.LoaderArgs) {
    await authenticate(request, '/customers')
    const customers = await repository.loadCustomers();
    return {customers};
}

export default function CustomerList({loaderData}: Route.ComponentProps) {
    const {customers} = loaderData;
    return (
        <CustomerListPage customers={customers}/>
    )
}


