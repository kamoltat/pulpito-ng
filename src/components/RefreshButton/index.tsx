import { useIsFetching, useQueryClient } from "@tanstack/react-query";
import RefreshIcon from "@mui/icons-material/Refresh";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import { CircularProgress } from "@mui/material";
import { onlineManager } from "@tanstack/react-query";

import { useDebounce } from "usehooks-ts";

export default function RefreshButton() {
  const isOnline = onlineManager.isOnline();
  const queryClient = useQueryClient();
  const isFetching = useIsFetching();
  const debouncedIsFetching = useDebounce(isFetching, 25);
  if (!isOnline) return <CloudOffIcon />;
  else if (!debouncedIsFetching) {
    return (
      <RefreshIcon
        onClick={() => {
          queryClient.invalidateQueries();
        }}
      />
    );
  } else
    return (
      <CircularProgress
        color="inherit"
        size={24}
        onClick={() => {
          queryClient.cancelQueries();
        }}
      />
    );
};
