// Extend the TypeText interface
declare module "@mui/material/styles" {
  interface TypeText {
    fade: string;
  }

  interface Palette {
    banner: string;
  }

  interface PaletteOptions {
    banner?: string;
  }
}
