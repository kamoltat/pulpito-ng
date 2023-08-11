import DescriptionIcon from "@mui/icons-material/Description";
import Tooltip from '@mui/material/Tooltip';
import {
  useMaterialReactTable,
  MaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table';
import type { UseQueryResult } from "@tanstack/react-query";
import { type Theme } from "@mui/material/styles";

import { formatDate, formatDuration } from "../../lib/utils";
import IconLink from "../../components/IconLink";
import Link from "../../components/Link";
import type { Job, NodeJobs, Run } from "../../lib/paddles.d";
import { dirName } from "../../lib/utils";
import useDefaultTableOptions from "../../lib/table";

import sentryIcon from "./assets/sentry.svg";


const columns: MRT_ColumnDef<Job>[] = [
  {
    header: "status",
    accessorKey: "status",
    size: 120,
    filterVariant: "select",
    // filterSelectOptions: ["pass", "fail", "dead", "running", "waiting", "unknown"],
    Cell: ({ row }) => {
      let failure_reason = row.original.failure_reason || "";
      const max_length = 800;
      const ellipsis = "...";
      if ( failure_reason.length > max_length ) {
        failure_reason = failure_reason.substring(0, max_length - ellipsis.length) + ellipsis;
      }
      return (
        <Tooltip title={failure_reason}>
          <span>{row.original.status}</span>
        </Tooltip>
      );
    }
  },
  {
    header: "links",
    id: "links",
    size: 75,
    Cell: ({ row }) => {
      const log_url = row.original.log_href;
      const sentry_url = row.original.sentry_event;
      return (
        <div>
          {log_url? (
            <IconLink to={dirName(log_url)}>
              <DescriptionIcon fontSize="small" />
            </IconLink>
          ) : null}
          {sentry_url ? (
            <IconLink to={sentry_url}>
              <img
                src={`${sentryIcon}`}
                alt="Sentry icon"
                style={{height: '20px', width: '20px'}}
              />
            </IconLink>
          ) : null}
        </div>
      );
    },
  },
  {
    header: "job ID",
    accessorKey: "job_id",
    size: 110,
    Cell: ({ row }) => {
      return (
        <Link
          to={`/runs/${row.original.name}/jobs/${row.original.job_id}`}
          color="inherit"
        >
            {row.original.job_id}
        </Link>
      );
    },
  },
  {
    header: "posted",
    id: "posted",
    accessorFn: (row: Job) => formatDate(row.posted),
    filterVariant: 'date',
    sortingFn: "datetime",
    size: 150,
  },
  {
    header: "updated",
    id: "updated",
    accessorFn: (row: Job) => formatDate(row.updated),
    filterVariant: 'date',
    sortingFn: "datetime",
    size: 150,
  },
  {
    header: "started",
    id: "started",
    accessorFn: (row: Job) => formatDate(row.started),
    filterVariant: 'date',
    sortingFn: "datetime",
    size: 150,
  },
  {
    header: "runtime",
    id: "runtime",
    size: 110,
    accessorFn: (row: Job) => {
      const start = Date.parse(row.started);
      const end = Date.parse(row.updated);
      if (!end || !start) return null;
      return formatDuration(Math.round((end - start) / 1000));
    },
    enableColumnFilter: false,
  },
  {
    header: "duration",
    id: "duration",
    size: 120,
    accessorFn: (row: Job) =>
      formatDuration(row.duration),
    enableColumnFilter: false,
  },
  {
    header: "in waiting",
    id: "waiting",
    size: 100,
    accessorFn: (row: Job) => {
      const start = Date.parse(row.started);
      const end = Date.parse(row.updated);
      if (!end || !start || !row.duration) return null;
      return formatDuration(Math.round((end - start) / 1000 - row.duration));
    },
    enableColumnFilter: false,
  },
  {
    header: "machine type",
    accessorKey: "machine_type",
    filterVariant: "select",
  },
  {
    header: "OS type",
    size: 85,
    accessorFn: (row: Job) => row.os_type + "",
    filterVariant: "select",
  },
  {
    header: "OS version",
    accessorFn: (row: Job) => row.os_version + "",
    size: 85,
    filterVariant: "select",
  },
  {
    header: "nodes",
    accessorKey: "nodes",
    accessorFn: (row: Job) => {
      return Object.keys(row.targets || {}).length || 0;
    },
    size: 85,
  },
];

function jobStatusToThemeCategory(status: string): keyof Theme["palette"] {
  switch (status) {
    case "dead": return "error";
    case "fail": return "error";
    case "finished fail": return "error";
    case "pass": return "success";
    case "finished pass": return "success";
    case "running": return "warning";
    default: return "info";
  }
};


type JobListProps = {
  query: UseQueryResult<Run> | UseQueryResult<NodeJobs>;
}

export default function JobList({ query }: JobListProps) {
  const options = useDefaultTableOptions<Job>();
  const data = query.data?.jobs || [];
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
        runtime: false,
        waiting: false,
      },
      pagination: {
        pageIndex: 0,
        pageSize: 25,
      },
      sorting: [
        {
          id: "job_id",
          desc: false,
        },
      ],
    },
    state: {
      isLoading: query.isLoading || query.isFetching,
    },
      const category = jobStatusToThemeCategory(row.original.status);
      if ( category ) return { className: category };
      return {};
    },
  });
  if (query.isError) return null;
  return <MaterialReactTable table={table} />
}
