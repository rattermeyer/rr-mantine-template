import type {CustomerView} from '~/shared/infrastructure/db/model/kysely/tables';
import {useMemo} from 'react';
import {MantineReactTable, type MRT_ColumnDef, useMantineReactTable} from 'mantine-react-table';
import {Button} from '@mantine/core';
import {NavLink} from 'react-router';
import {RemixFormProvider, useRemixForm} from 'remix-hook-form';
import {CustomerForm} from '~/pages/CustomerListPage/ui/CustomerForm';
import type {Customer} from '~/shared/domain/Customer.model';
import {RowActions} from '~/components/RowActions/RowActions';

export function CustomerListPage(props: { customers: Customer[] }) {
    const {customers} = props;
    const columns = useMemo<MRT_ColumnDef<Customer>[]>(() => [
        {
            accessorKey: 'firstName',
            header: 'First Name',
        },
        {
            accessorKey: 'lastName',
            header: 'Last Name',
        },
        {
            accessorKey: 'company',
            header: 'Company',
        },
        {
            accessorKey: 'address',
            header: 'Address',
        },
        {
            accessorKey: 'country',
            header: 'Country'
        }
    ], []);

    const table = useMantineReactTable({
        columns,
        data: customers,
        getRowId: (row) => String(row.customerId),
        enableRowActions: true,
        enableGrouping: true,
        renderRowActions: (row) => (<RowActions urlPrefix={"/customers"} id={row.row.id} keyDisplay={row.row.original.firstName ?? ''}/>),
        renderTopToolbarCustomActions: ({table}) => (
            <Button size="xs" color="blue" component={NavLink} to="/customers/new">New Customer</Button>
        ),
        renderDetailPanel: (row) => {
            const customerRow = row.row.original;
            const form = useRemixForm<CustomerView>
            ({
                defaultValues: customerRow,
                mode: 'onSubmit',
                reValidateMode: 'onBlur'
            });
            return (

                <RemixFormProvider {...form}>
                    <CustomerForm editable={false}/>
                </RemixFormProvider>

            )
        },
    })
    return <MantineReactTable table={table}/>
}
