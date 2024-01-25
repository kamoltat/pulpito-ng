import { Helmet } from "react-helmet";
import { useQueryParams, BooleanParam, withDefault } from "use-query-params";
import Typography from "@mui/material/Typography";

import RunList from "../../components/RunList";

export default function Queue() {
  const [params, setParams] = useQueryParams({
    queued: withDefault(BooleanParam, true),
  }, {
    removeDefaultsFromUrl: true,
    updateType: "push",
  });
  const tableOptions = {
    enableFilters: false,
    enablePagination: false,
  }
  return (
    <div>
      <Helmet>
        <title>Queue - Pulpito</title>
      </Helmet>
      <Typography variant="h5" style={{ margin: "20px" }}>
        Queue
      </Typography>
      <RunList params={params} setter={setParams} tableOptions={tableOptions} />
    </div>
  );
}
