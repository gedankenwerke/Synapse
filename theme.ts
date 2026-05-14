import { createTheme } from "@mantine/core";

export const theme = createTheme({
  primaryColor: "orange",
  primaryShade: 6,
  black: "#212529",
  defaultRadius: "sm",
  fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
  headings: {
    fontFamily: "var(--font-geist-sans), Arial, Helvetica, sans-serif",
  },
  colors: {
    orange: [
      "#fff4e6",
      "#ffe8cc",
      "#ffd1a3",
      "#ffb870",
      "#ff9d3d",
      "#ff8a1a",
      "#f76b00",
      "#d65d00",
      "#b34f00",
      "#994200",
    ],
    gray: [
      "#f8f9fa",
      "#f1f3f5",
      "#e9ecef",
      "#dee2e6",
      "#ced4da",
      "#adb5bd",
      "#868e96",
      "#495057",
      "#343a40",
      "#212529",
    ],
  },
});