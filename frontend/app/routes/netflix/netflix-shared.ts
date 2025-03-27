import type { MRT_ColumnDef } from "mantine-react-table";
import type { NetflixEntity } from "~/shared/infrastructure/db/model/kysely/entities";

export function columnDefinitions(): MRT_ColumnDef<NetflixEntity>[] {
	return [
		{
			accessorKey: "country",
			header: "Country",
		},
		{
			accessorKey: "type",
			header: "Type",
		},
		{
			accessorKey: "title",
			header: "Title",
			enableGrouping: false,
		},
		{
			accessorKey: "rating",
			header: "Rating",
			enableGrouping: false,
		},
		{
			accessorKey: "duration",
			header: "Duration",
			enableGrouping: false,
		},
		{
			accessorKey: "listedIn",
			header: "Listed In",
			enableGrouping: false,
		},
		{
			accessorKey: "director",
			header: "Director",
			enableGrouping: true,
			filterVariant: "select",
		},
		{
			accessorKey: "releaseYear",
			header: "Release Year",
			enableGrouping: true,
		},
	];
}
