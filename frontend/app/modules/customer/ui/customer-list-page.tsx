import { Button, Flex } from "@mantine/core";
import {
	type MRT_ColumnDef,
	MantineReactTable,
	useMantineReactTable,
} from "mantine-react-table";
import { useMemo } from "react";
import { Link, NavLink } from "react-router";
import { RemixFormProvider, useRemixForm } from "remix-hook-form";
import { RowActions } from "~/components/row-actions/row-actions";
import { CustomerForm } from "~/modules/customer/ui/customer-form";
import type { Customer } from "~/shared/domain/customer.model";
import type { CustomerView } from "~/shared/infrastructure/db/model/kysely/tables";

export function CustomerListPage(props: { customers: Customer[] }) {
	const { customers } = props;
	const columns = useMemo<MRT_ColumnDef<Customer>[]>(
		() => [
			{
				accessorKey: "firstName",
				header: "First Name",
			},
			{
				accessorKey: "lastName",
				header: "Last Name",
			},
			{
				accessorKey: "company",
				header: "Company",
			},
			{
				accessorKey: "address",
				header: "Address",
			},
			{
				accessorKey: "country",
				header: "Country",
			},
		],
		[],
	);

	const table = useMantineReactTable({
		columns,
		data: customers,
		getRowId: (row) => String(row.customerId),
		enableRowActions: true,
		enableGrouping: true,
		renderRowActions: (row) => (
			<RowActions
				urlPrefix={"/customers"}
				id={row.row.id}
				keyDisplay={row.row.original.firstName ?? ""}
			/>
		),
		renderTopToolbarCustomActions: ({ table }) => (
			<Flex gap="md">
				<Button size="xs" color="blue" component={NavLink} to="/customers/new">
					New Customer
				</Button>
				<Button
					size="xs"
					color="blue"
					component={Link}
					reloadDocument={true}
					to="/customers/export"
				>
					CSV (server)
				</Button>
				<Button
					size="xs"
					color="blue"
					component={Link}
					reloadDocument={true}
					to="/customers/export?format=xlsx"
				>
					XLSX (server)
				</Button>
			</Flex>
		),
		renderDetailPanel: (row) => {
			const customerRow = row.row.original;
			const form = useRemixForm<CustomerView>({
				defaultValues: customerRow,
				mode: "onSubmit",
				reValidateMode: "onBlur",
			});
			return (
				<RemixFormProvider {...form}>
					<CustomerForm editable={false} />
				</RemixFormProvider>
			);
		},
	});
	return <MantineReactTable table={table} />;
}
