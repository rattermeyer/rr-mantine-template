import {sql} from "kysely";
import {executeWithOffsetPagination} from "kysely-paginate";
import {
    MantineReactTable,
    type MRT_ColumnDef,
    type MRT_ColumnFiltersState,
    type MRT_SortingState,
    useMantineReactTable,
} from "mantine-react-table";
import {useEffect, useMemo, useState} from "react";
import {useNavigation, useSearchParams} from "react-router";
import {columnDefinitions} from "~/routes/netflix/netflix-shared";
import {kyselyBuilder} from "~/shared/infrastructure/db/db.server";
import type {NetflixEntity} from "~/shared/infrastructure/db/model/kysely/entities";
import type {Route} from "./+types/netflix-server";
import {useDebouncedState} from '@mantine/hooks';

export function meta() {
    return [{title: "Netflix Shows"}];
}

export async function loader({request}: Route.LoaderArgs) {
    const searchParams = new URL(request.url).searchParams;
    const db = kyselyBuilder();
    let query = db.selectFrom("netflix");
    const paginationParams = {
        perPage: Number.parseInt(searchParams.get("perPage") ?? "10") || 10,
        page: (Number.parseInt(searchParams.get("page") ?? "1") || 1) + 1,
    };
    const sorting = JSON.parse(
        searchParams.get("sorting") ?? "[]",
    ) as MRT_SortingState; // TODO validation
    const columnFilters = JSON.parse(
        searchParams.get("columnFilters") ?? "[]",
    ) as MRT_ColumnFiltersState; // TODO validation
    console.log(columnFilters);
    for (const filter of columnFilters) {
        // @ts-ignore TODO: fix this
        query = query.where(filter.id, "like", `%${filter.value}%`);
    }
    const globalFilter = searchParams.get("globalFilter") ?? "";
    if (globalFilter.length > 0) {
        query = query.where((eb) =>
            eb.or([
                eb("globalText", "@@", sql<string>`to_tsquery(${globalFilter})`),
                eb("globalText", "ilike", `%${globalFilter}%`),
            ]),
        );
    }
    const countQuery = query.select((eb) => eb.fn.countAll().as("rowCount"));
    for (const sort of sorting) {
        // @ts-ignore TODO: fix this
        query = query.orderBy(sort.id, sort.desc ? "desc" : "asc");
    }
    const totalRowCount = (await countQuery.executeTakeFirstOrThrow())
        .rowCount as number;
    const netflix = await executeWithOffsetPagination(query.selectAll(), {
        ...paginationParams,
    });
    return {
        netflix, paginationParams: {
            page: paginationParams.page - 1,
            perPage: paginationParams.perPage,
        }, totalRowCount
    };
}

export default function NetflixServerRoute({
                                               loaderData,
                                           }: Route.ComponentProps) {
    const {netflix, paginationParams: incomingPaginationParams, totalRowCount} = loaderData;
    const paginationParams = {
        page: incomingPaginationParams.page-1, // -1 because the table component uses 0-based index
        perPage: incomingPaginationParams.perPage,
    }
    const [searchParams, setSearchParams] = useSearchParams();
    const {rows, hasNextPage, hasPrevPage} = netflix;
    //store pagination state in your own state
    const [pagination, setPagination] = useDebouncedState({
        pageIndex: paginationParams.page,
        pageSize: paginationParams.perPage, //customize the default page size
    }, 200);
    const sortingState = JSON.parse(
        searchParams.get("sorting") ?? "[]",
    ) as MRT_SortingState;
    const [sorting, setSorting] = useState<MRT_SortingState>(sortingState);
    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
        [],
    );
    const [data, setData] = useState<NetflixEntity[]>([]);
    const [rowCount, setRowCount] = useState<number>(0);
    const [globalFilter, setGlobalFilter] = useState("");
    const navigation = useNavigation();
    const [isRefetching, setIsRefetching] = useState(false);
    const isNavigating = Boolean(navigation.location);

    // this triggers navigation, when table state changes
    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        //do something when the pagination state changes
        setSearchParams({
            page: String(pagination.pageIndex+1), // +1 because the server uses 1-based index
            perPage: String(pagination.pageSize),
            sorting: JSON.stringify(sorting),
            columnFilters: JSON.stringify(columnFilters),
            globalFilter: globalFilter ?? "",
        }, {
            preventScrollReset: true,
        });
    }, [
        pagination.pageIndex,
        pagination.pageSize,
        sorting,
        columnFilters,
        globalFilter,
    ]);

    // this is triggered, when incoming data changes
    useEffect(() => {
        setData(rows);
        setRowCount(totalRowCount);
        setIsRefetching(isNavigating);
        setPagination({
            pageIndex: paginationParams.page,
            pageSize: paginationParams.perPage,
        })
    }, [rows, totalRowCount, paginationParams.perPage, paginationParams.page, isNavigating, setPagination]);

    const columns = useMemo<MRT_ColumnDef<NetflixEntity>[]>(
        () => columnDefinitions(),
        [],
    );
    const table = useMantineReactTable({
        columns,
        data,
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        rowCount,
        getRowId: (row) => String(row.showId),
        renderDetailPanel: (row) => {
            return <div>{row.row.original.description}</div>;
        },
        state: {
            pagination,
            sorting,
            columnFilters,
            globalFilter,
            showProgressBars: isRefetching,
        },
    });
    return (
        <div>
            <MantineReactTable table={table}/>
        </div>
    );
}
