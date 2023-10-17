import { PropsWithChildren } from 'react'
import { useQueryParams, StringParam, NumberParam } from "use-query-params";
import { styled } from "@mui/material/styles";
import { useParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { format } from "date-fns";
import { Helmet } from "react-helmet";

import type { Run, RunParams } from "../../lib/paddles.d";

import { useRun } from "../../lib/paddles";
import JobList from "../../components/JobList";
import Link from "../../components/Link";

const PREFIX = "index";

const classes = {
  root: `${PREFIX}-root`,
};

const Root = styled("div")(() => ({
  [`&.${classes.root}`]: {
    "& .MuiButton-root": {
      textTransform: "none",
    },
  },
}));

type FilterLinkProps = {
  to: string
}

const FilterLink = (props: PropsWithChildren<FilterLinkProps>) => (
  <Link sx={{mx: 0.33}} to={props.to}>
    {props.children}
  </Link>
);

type StatusLabels = {
  [key: string]: string;
}

export default function Run() {
  const [params, setParams] = useQueryParams({
    status: StringParam,
    page: NumberParam,
    pageSize: NumberParam,
  });
  const { name } = useParams<RunParams>();
  const query = useRun(name === undefined ? "" : name);
  if (query === null) return <Typography>404</Typography>;
  if (query.isError) return null;
  const data: Run | undefined = query.data;
  const suite = data?.suite;
  const branch = query.data?.branch;
  const statuses = ["pass", "fail", "dead", "running", "waiting", "queued"];
  const statusLabels: StatusLabels = {};
  statuses.forEach(item => {
    statusLabels[item] = item.charAt(0).toUpperCase() + item.slice(1);
    if ( data?.results[item] ) statusLabels[item] += ` (${data.results[item]})`;
  });
  const date = query.data?.scheduled
    ? format(new Date(query.data.scheduled), "yyyy-MM-dd")
    : null;
  return (
    <Root className={classes.root}>
      <Helmet>
        <title>{`${name} - Pulpito`}</title>
      </Helmet>
      <Typography variant="h5" style={{ margin: "20px 0px" }}>
        {name}
      </Typography>
      <div style={{ margin: "20px 0px" }}>
        See runs with the same:
        <FilterLink to={`/runs/?branch=${branch}`}>
            branch
        </FilterLink>
        <FilterLink to={`/runs/?suite=${suite}&branch=${branch}`}>
            suite and branch
        </FilterLink>
        <FilterLink to={`/runs/?date=${date}`}>
          date
        </FilterLink>
      </div>
      <ButtonGroup style={{ display: "flex", justifyContent: "center" }}>
        <Button
          onClick={() => {
            setParams({ status: null });
          }}
          variant={params.status ? "outlined" : "contained"}
        >
          All
        </Button>
        {statuses.filter(item => data?.results[item]).map((item) => (
          <Button
            key={item}
            onClick={() => {
              setParams({ status: item });
            }}
            variant={params.status === item ? "contained" : "outlined"}
          >
            {statusLabels[item]}
          </Button>
        ))}
      </ButtonGroup>
      <JobList query={query} params={params} setter={setParams} pagingMode={"client"} />
    </Root>
  );
}
