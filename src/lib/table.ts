import { MRT_RowData, type MRT_TableOptions } from 'material-react-table';
import { useTheme } from "@mui/material/styles";


export default function useDefaultTableOptions<TData extends MRT_RowData>(): Partial<MRT_TableOptions<TData>> {
  const theme = useTheme();
  const palette = theme.palette;
  return {
    layoutMode: "grid",
    defaultColumn: {
      minSize: 20,
      maxSize: 200,
      size: 75,
    },
    // enableColumnResizing: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableGlobalFilter: false,
    // enableRowSelection: true,
    initialState: {
        density: "compact",
        showColumnFilters: true,
    },
    mrtTheme: {
      baseBackgroundColor: theme.palette.background.default,
    },
    muiTableBodyCellProps: {
      sx: {
        color: "black",
        fontSize: "0.75rem",
      }
    },
    muiTableBodyProps: {
      sx: {
        'tr td': {padding: '2px'},
        'tr td:nth-of-type(1)': {paddingLeft: '8px'},
        'tr.error td': {backgroundColor: palette.error.main},
        'tr.warning td': {backgroundColor: palette.warning.main},
        'tr.info td': {backgroundColor: palette.info.main},
        'tr.success td': {backgroundColor: palette.success.main},
        '@media (prefers-color-scheme: dark)': {
          'tr:hover td': {filter: "brightness(85%)"},
        },
        '@media (prefers-color-scheme: light)': {
          'tr:hover td': {filter: "brightness(115%)"},
        },
      },
    },
    muiTableBodyRowProps: ({row}) => {
      const category = statusToThemeCategory(row.original.status);
      return {
        className: category,
      }
    },
    muiTablePaperProps: {
      sx: {
        border: "1px solid " + theme.palette.grey[800],
      },
    },
  }
}
