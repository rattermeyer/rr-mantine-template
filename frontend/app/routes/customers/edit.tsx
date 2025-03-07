import type {Route} from "./+types/edit";
import {kyselyBuilder} from '~/shared/infrastructure/db/db.server';
import type {Customer} from '~/shared/infrastructure/db/model/kysely/database';

export async function loader({request, params}: Route.LoaderArgs) {
    const {id = '0'} = params;
    const kysely = kyselyBuilder();
    const result = await kysely.selectFrom('customer')
        .where('customerId', '=', Number.parseInt(id))
        .selectAll()
        .limit(1).execute();
    if (result && result.length > 0) {
        return {customer: result[0]};
    }
    return {customer: {} as Customer};
}

export default function EditCustomer({loaderData}: Route.ComponentProps) {
    const { customer } = loaderData;
    return (
        <div>
            Edit customer <pre>{JSON.stringify(customer, null, 2)}</pre>
        </div>
    )
}
