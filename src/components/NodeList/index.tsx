import type { UseQueryResult } from "@tanstack/react-query";
import {
  useMaterialReactTable,
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import Link from '@mui/material/Link';

import type { Node } from "../../lib/paddles.d";
import { formatDate } from "../../lib/utils";
import useDefaultTableOptions from "../../lib/table";


export const columns: MRT_ColumnDef<Node>[] = [
  {
    header: "name",
    accessorKey: "name",
    size: 100,
    Cell: ( { row } ) => {
      const name = row.original.name;
      return <Link href={`/nodes/${name}/`} color="inherit">{name?.split(".")[0]}</Link>;
    },
  },
  {
    header: "machine_type",
    accessorKey: "machine_type",
    size: 90,
    maxSize: 90,
  },
  {
    header: "🔌",
    accessorFn: (row: Node) => row.up?.toLocaleString(),
    size: 50,
    filterVariant: "select",
  },
  {
    header: "🔒",
    accessorFn: (row: Node) => row.locked?.toLocaleString(),
    size: 40,
    filterVariant: "select",
  },
  {
    header: "locked since",
    filterVariant: 'date',
    sortingFn: "datetime",
    accessorFn: (row: Node) => formatDate(row.locked_since),
    size: 90,
    enableColumnFilter: false,
  },
  {
    header: "locked by",
    accessorKey: "locked_by",
    size: 120,
    filterVariant: "select",
  },
  {
    header: "OS type",
    accessorFn: (row) => row.os_type || "none",
    size: 70,
    filterVariant: "select",
  },
  {
    header: "OS ver.",
    accessorFn: (row) => row.os_version || "none",
    size: 70,
    filterVariant: "select",
  },
  {
    header: "arch",
    accessorKey: "arch",
    size: 60,
    filterVariant: "select",
  },
  {
    header: "description",
    accessorKey: "description",
    size: 500,
  },
];

interface NodeListProps {
  query: UseQueryResult<Node[]>;
}

export default function NodeList({ query }: NodeListProps) {
  const options = useDefaultTableOptions<Node>();
  const data = query.data || [];
  if ( data.length === 1 ) {
    options.enableFilters = false;
    options.enablePagination = false;
    options.enableTableFooter = false;
    options.enableTopToolbar = false;
    options.enableBottomToolbar = false;
  }
  const table = useMaterialReactTable({
    ...options,
    columns,
    data: data,
    rowCount: data.length,
    enableFacetedValues: true,
    initialState: {
      ...options.initialState,
      columnVisibility: {
        posted: false,
        updated: false,
        name: data.length > 1? true : false,
        machine_type: data.length > 1? true : false,
      },
      pagination: {
        pageIndex: 0,
        pageSize: 25,
      },
      sorting: [
        {
          id: "machine_type",
          desc: false,
        },
        {
          id: "name",
          desc: false,
        },
      ],
    },
    state: {
      isLoading: query.isLoading || query.isFetching,
    },
    muiTableBodyRowProps: ({row}) => {
      let className = "info";
      if ( row.original.up === false ) className = "error";
      else if ( row.original.locked === true ) className = "warning";
      else if ( row.original.locked === false ) className = "success";
      return {className};
    },
  });
  return <MaterialReactTable table={table} />
}
