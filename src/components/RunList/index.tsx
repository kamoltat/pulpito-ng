import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import type {
  DecodedValueMap,
  QueryParamConfigMap,
  SetQuery,
} from "use-query-params";
import { useDebounce } from "usehooks-ts";
import type {
  GridFilterModel,
  GridRowClassNameParams,
  GridValueFormatterParams,
  GridValueGetterParams,
  GridRenderCellParams,
  GridColDef,
} from "@mui/x-data-grid";

import { useRuns } from "../../lib/paddles";
import { formatDate, formatDuration } from "../../lib/utils";
import DataGrid from "../DataGrid";
import IconLink from "../../components/IconLink";

function resultsGetter(params: GridValueGetterParams) {
  return params.row.results[params.field];
}

const columns: GridColDef[] = [
  {
    field: "user",
  },
  {
    field: "name",
    headerName: "link",
    width: 60,
    renderCell: (params: GridRenderCellParams) => {
      return (
        <IconLink to={`/runs/${params.value}`}>
          <OpenInNewIcon />
        </IconLink>
      );
    },
  },
  {
    field: "scheduled",
    type: "date",
    valueFormatter: (row: GridValueFormatterParams) => formatDate(row.value),
    width: 125,
  },
  {
    field: "started",
    type: "date",
    valueFormatter: (row: GridValueFormatterParams) => formatDate(row.value),
    width: 125,
  },
  {
    headerName: "updated",
    field: "posted",
    type: "date",
    valueFormatter: (row: GridValueFormatterParams) => formatDate(row.value),
    width: 125,
  },
  {
    headerName: "runtime",
    field: "",
    valueGetter: (params: GridValueGetterParams) => {
      const start = Date.parse(params.row.started);
      const end = Date.parse(params.row.posted);
      if (!end || !start) return null;
      return Math.round((start - end) / 1000);
    },
    valueFormatter: (row: GridValueFormatterParams) => formatDuration(row.value),
    width: 70,
  },
  {
    field: "suite",
  },
  {
    field: "branch",
  },
  {
    field: "machine_type",
    width: 90,
  },
  {
    field: "sha1",
    headerName: "hash",
    width: 75,
  },
  {
    field: "queued",
    valueGetter: resultsGetter,
    width: 60,
  },
  {
    field: "pass",
    valueGetter: resultsGetter,
    width: 60,
  },
  {
    field: "fail",
    valueGetter: resultsGetter,
    width: 60,
  },
  {
    field: "dead",
    valueGetter: resultsGetter,
    width: 60,
  },
  {
    field: "running",
    valueGetter: resultsGetter,
    width: 60,
  },
  {
    field: "waiting",
    valueGetter: resultsGetter,
    width: 60,
  },
];

interface RunListProps {
  params: DecodedValueMap<QueryParamConfigMap>;
  setter: SetQuery<QueryParamConfigMap>;
}

export default function RunList({ params, setter }:RunListProps) {
  const paddlesParams = {...params};
  delete paddlesParams.user;
  const debouncedParams = useDebounce(params, 500);
  const query = useRuns(debouncedParams);
  if (query.isError) return null;
  /*  If we want to automatically size the branch column:
  const columns = [..._columns];
  if (query.isSuccess) {
    const branchLength = Math.max(
      ...query.data.map((item) => item.branch.length)
    );
    columns.forEach((item) => {
      if (item.field === "branch") {
        item.width = Math.max(100, branchLength * 7);
      }
    });
  }
  */
  let filterModel: GridFilterModel = { items: [] };
  if (params.user) {
    filterModel = {
      items: [
        {
          field: "user",
          value: params.user,
          operator: "contains",
        },
      ],
    };
  }
  const onFilterModelChange = (model: GridFilterModel) => {
    const params: QueryParamConfigMap = {};
    model.items.forEach((item) => {
      params[item.field] = item.value || null;
    });
    setter(params);
  };
  return (
    <DataGrid
      columns={columns}
      rows={query.data || []}
      loading={query.isLoading || query.isFetching}
      initialState={{
        sorting: {
          sortModel: [
            {
              field: "scheduled",
              sort: "desc",
            },
          ],
        },
      }}
      filterMode="client"
      filterModel={filterModel}
      onFilterModelChange={onFilterModelChange}
      paginationMode="server"
      pageSize={params.pageSize}
      page={params.page}
      onPaginationModelChange={setter}
      getRowClassName={(params: GridRowClassNameParams) => {
        const status = params.row.status.split(" ").pop();
        return `status-${status}`;
      }}
    />
  );
}
