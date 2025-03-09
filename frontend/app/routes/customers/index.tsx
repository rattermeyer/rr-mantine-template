import type {Route} from "./+types/index"
import {CustomerListPage} from '~/pages/CustomerListPage/CustomerListPage';
import {container} from '~/InversifyConfig';
import type {CustomerRepository} from '~/pages/CustomerListPage/domain/Customer.repository';
import type {DB} from '~/shared/infrastructure/db/model/kysely/tables';
import type {Kysely} from 'kysely';

export async function loader({request}: Route.LoaderArgs) {
    const factory: (kysely?: Kysely<DB>) => CustomerRepository = container.get("Factory<CustomerRepository>");
    const customers = await factory().loadCustomers();
    return {customers};
}

export default function CustomerList({loaderData}: Route.ComponentProps) {
    const {customers} = loaderData;
    return (
        <CustomerListPage customers={customers}/>
    )
}


