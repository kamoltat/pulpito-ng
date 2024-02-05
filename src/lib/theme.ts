import { green, lightBlue, orange, red } from "@mui/material/colors";
import {
  type ThemeOptions,
} from "@mui/material/styles";

export default function getThemeOptions(mode: "dark" | "light"): ThemeOptions {
  const darkShade = 200;
  const lightShade = 100;
  return mode === "dark"? {
    palette: {
      mode: "dark",
      background: {
        default: "#181818",
        paper: "#303030",
      },
      primary: {
        main: lightBlue[700],
      },
      error: {
        main: red[darkShade],
      },
      info: {
        main: lightBlue[darkShade],
      },
      success: {
        main: green[darkShade],
      },
      warning: {
        main: orange[darkShade],
      },
    },
  } : {
    palette: {
      mode: "light",
      primary: {
        main: lightBlue[600],
      },
      error: {
        main: red[lightShade],
      },
      info: {
        main: lightBlue[lightShade],
      },
      success: {
        main: green[lightShade],
      },
      warning: {
        main: orange[lightShade],
      },
    },
  };
}
