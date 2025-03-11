import type {Route} from './+types/delete'
import {redirect} from 'react-router';
import {zfd} from 'zod-form-data';
import {z} from 'zod';
import {container} from '~/InversifyConfig.server';
import {CustomerService} from '~/shared/domain/CustomerService';
import {authenticate} from '~/shared/services/auth.server';

const schema = zfd.formData({id: z.string()});
const service = container.get<CustomerService>(CustomerService);

export async function action({request, params}: Route.ActionArgs) {
    await authenticate(request)
    const {id} = schema.parse(await request.formData());
    console.log(`delete customer with id ${id}`);
    await service.deleteCustomer(Number.parseInt(id));
    return redirect('/customers')
}
