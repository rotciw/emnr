import { DefaultTheme } from "styled-components";

declare module "styled-components" {
  export interface DefaultTheme {
    red: string;
    light: string;
    lightBlue: string;
    blue: string;
    darkBlue: string;
    white: string;
    black: string;
  }
}

export const defaultTheme: DefaultTheme = {
	red: "#E63946",
  light: "#F1FAEE",
  lightBlue: "#A8DADC",
  blue: "#457B9D",
  darkBlue: "#1D3557",
  white: "#FFF",
  black: "#000",
};
