"use client";

import { createTheme } from "@mui/material/styles";

/**
 * ReadyMade console theme — maps the Figma design system onto MUI v9.
 * Fonts come from next/font CSS variables set in the root layout.
 */
const faktum = "var(--font-faktum), var(--font-hanken), system-ui, sans-serif";
const inter = "var(--font-inter), system-ui, sans-serif";
const mono = "var(--font-jetbrains), ui-monospace, monospace";

const theme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: {
      main: "#45d2af", // Primary/500
      light: "#d9f6ef", // Primary/100
      dark: "#26a564", // Secondary/700 (deep teal)
      contrastText: "#0e0f0c",
    },
    secondary: {
      main: "#171717", // Secondary/900 — dark action
      light: "#2e2e2e",
      contrastText: "#fcfcfc",
    },
    success: { main: "#1fc16b", contrastText: "#ffffff" }, // Green/200
    error: { main: "#d00416", contrastText: "#ffffff" }, // Red/200
    warning: { main: "#c98a1a" },
    background: {
      default: "#fcfcfc", // Secondary/0 canvas
      paper: "#ffffff",
    },
    text: {
      primary: "#171717",
      secondary: "#5d5d5d", // Secondary/600
      disabled: "#a2a2a2",
    },
    divider: "#e8ebe6", // grey/91 hairline
    grey: {
      100: "#f5f5f5",
      200: "#edecec",
      300: "#e8ebe6",
      400: "#d2d2d2",
      500: "#a2a2a2",
      600: "#747474",
      700: "#5d5d5d",
      800: "#2e2e2e",
      900: "#171717",
    },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: inter,
    h1: { fontFamily: faktum, fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontFamily: faktum, fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontFamily: faktum, fontWeight: 700, letterSpacing: "-0.01em" },
    h4: { fontFamily: faktum, fontWeight: 700, letterSpacing: "-0.01em" },
    h5: { fontFamily: inter, fontWeight: 700 },
    h6: { fontFamily: inter, fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
    caption: { fontFamily: mono },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: "#fcfcfc" },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: "none" },
        outlined: { borderColor: "#e8ebe6" },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0, variant: "outlined" },
      styleOverrides: {
        root: { borderRadius: 16, borderColor: "#e8ebe6" },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: 999, paddingInline: 18, paddingBlock: 9 },
        sizeSmall: { paddingInline: 14, paddingBlock: 6 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600, fontFamily: inter },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 10 },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#171717",
          fontFamily: inter,
          fontSize: 12,
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;
