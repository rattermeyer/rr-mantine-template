import type {Route} from './+types/netflix-server';
import {kyselyBuilder} from '~/shared/infrastructure/db/db.server';
import {executeWithOffsetPagination} from 'kysely-paginate';
import type {NetflixEntity} from '~/shared/infrastructure/db/model/kysely/entities';
import {columnDefinitions} from '~/routes/netflix/netflix-shared';
import {useEffect, useMemo, useState} from 'react';
import {
    MantineReactTable,
    type MRT_ColumnDef,
    type MRT_ColumnFiltersState,
    type MRT_SortingState,
    useMantineReactTable
} from 'mantine-react-table';
import {useSearchParams} from 'react-router';

export async function loader({request}: Route.LoaderArgs) {
    const searchParams = new URL(request.url).searchParams
    const db = kyselyBuilder()
    let query = db.selectFrom('netflix').selectAll();
    const paginationParams = {
        perPage: Number.parseInt(searchParams.get('perPage') ?? "10") || 10,
        page: Number.parseInt(searchParams.get('page') ?? "1") || 1,
    }
    const sorting = JSON.parse(searchParams.get('sorting') ?? "[]") as MRT_SortingState // TODO validation
    for (const sort of sorting) {
        query = query.orderBy(sort.id, sort.desc ? 'desc' : 'asc')
    }
    const columnFilters = JSON.parse(searchParams.get('columnFilters') ?? "[]") as MRT_ColumnFiltersState // TODO validation
    console.log(columnFilters)
    for (const filter of columnFilters) {
        query = query.where(filter.id, 'like', `%${filter.value}%`)
    }
    const totalRowCount = (await db.selectFrom('netflix').select(eb => eb.fn.countAll().as('rowCount')).executeTakeFirstOrThrow()).rowCount as number;
    const netflix = await executeWithOffsetPagination(query, {
        ...paginationParams,
    })
    return {netflix, paginationParams, totalRowCount};
}

export default function NetflixServerRoute({loaderData}: Route.ComponentProps) {
    const {netflix, paginationParams, totalRowCount} = loaderData;
    const {rows, hasNextPage, hasPrevPage} = netflix;
    //store pagination state in your own state
    const [pagination, setPagination] = useState({
        pageIndex: paginationParams.page,
        pageSize: paginationParams.perPage, //customize the default page size
    });
    const [sorting, setSorting] = useState<MRT_SortingState>([]);
    const [columnFilters, setColumnFilters] = useState<MRT_ColumnFiltersState>(
        [],
    );
    const [data, setData] = useState<NetflixEntity[]>([]);
    const [rowCount, setRowCount] = useState<number>(0);
    const [searchParams, setSearchParams] = useSearchParams();

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        //do something when the pagination state changes
        setSearchParams({
            page: String(pagination.pageIndex),
            perPage: String(pagination.pageSize),
            sorting: JSON.stringify(sorting),
            columnFilters: JSON.stringify(columnFilters),
        });
    }, [pagination.pageIndex, pagination.pageSize, sorting, columnFilters]);

    useEffect(() => {
        setData(rows)
        setRowCount(totalRowCount)
    }, [rows, totalRowCount]);


    const columns = useMemo<MRT_ColumnDef<NetflixEntity>[]>(() => columnDefinitions(), []);
    const table = useMantineReactTable({
        columns,
        data,
        manualPagination: true,
        manualSorting: true,
        manualFiltering: true,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        onColumnFiltersChange: setColumnFilters,
        rowCount,
        getRowId: (row) => String(row.showId),
        state: {pagination, sorting, columnFilters},
    })
    return (
        <div>
            <MantineReactTable table={table}/>
        </div>
    )

}



