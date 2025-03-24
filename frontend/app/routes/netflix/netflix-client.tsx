import type {Route} from './+types/netflix-client';
import {kyselyBuilder} from '~/shared/infrastructure/db/db.server';
import React, {useMemo} from 'react';
import {MantineReactTable, type MRT_ColumnDef, useMantineReactTable} from 'mantine-react-table';
import type {NetflixEntity} from '~/shared/infrastructure/db/model/kysely/entities';
import {columnDefinitions} from '~/routes/netflix/netflix-shared';

/** load the whole table with netflix shows from database.
 * pagination is performed on the client side.
 */
export async function loader({request}: Route.LoaderArgs) {
    const db = kyselyBuilder()
    const netflix = db.selectFrom('netflix').selectAll().execute();
    return {netflix};
}

export default function NetflixClientRoute({loaderData}: Route.ComponentProps) {
    const {netflix} = loaderData;
    return (
        <React.Suspense fallback={<div>Loading...</div>}>
            <NetflixTable p={netflix}/>
        </React.Suspense>
    )

}

function NetflixTable({p}: { p: Promise<NetflixEntity[]> }) {
    const data = React.use(p)
    const columns = useMemo<MRT_ColumnDef<NetflixEntity>[]>(() => columnDefinitions(), []);
    const table = useMantineReactTable({
        columns,
        data,
        enableFacetedValues: true,
        getRowId: (row) => String(row.showId),
        enableGrouping: true,
        enableRowVirtualization: true,
        enablePagination: false
    })
    return (
        <div>
            <MantineReactTable table={table}/>
        </div>
    )

}
