import type {CustomerView} from '~/shared/infrastructure/db/model/kysely/database';
import {useMemo} from 'react';
import {MantineReactTable, type MRT_ColumnDef, useMantineReactTable} from 'mantine-react-table';
import {Box, Button, Flex} from '@mantine/core';
import {NavLink} from 'react-router';

export function CustomerListPage(props: { customers: CustomerView[] }) {
    const {customers} = props;
    const columns = useMemo<MRT_ColumnDef<CustomerView>[]>(() => [
        {
            accessorKey: 'customerName',
            header: 'Name',
        },
        {
            accessorKey: 'company',
            header: 'Company',
        },
        {
            accessorKey: 'address',
            header: 'Address',
        }
    ], []);

    const table = useMantineReactTable({
        columns,
        data: customers,
        getRowId: (row) => String(row.customerId),
        enableRowActions: true,
        renderRowActions: (row) => (
            <Flex gap="sm">
                <Button size="xs" color="blue" component={NavLink} to={`/customers/edit/${row.row.id}`}>Edit</Button>
                <Button size="xs" color="red">Delete</Button>
            </Flex>

        ),
        mantineTableProps: {
            striped: "odd",
        }
    })
    return <MantineReactTable table={table} />
}
