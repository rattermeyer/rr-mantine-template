import type {Route} from "./+types/index"
import {kyselyBuilder} from '~/shared/infrastructure/db/db.server';
import {CustomerListPage} from '~/pages/CustomerListPage/CustomerListPage';


export async function loader({ request}: Route.LoaderArgs) {
    const kysely = kyselyBuilder()
    const customers = await kysely.selectFrom('customerView').selectAll().orderBy('customerName asc').execute();
    return {customers};
}

export default function CustomerList({ loaderData }: Route.ComponentProps) {
    const {customers} = loaderData;
    return (
        <CustomerListPage customers={customers} />
    )
}
