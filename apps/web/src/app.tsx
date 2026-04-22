import { useState } from "react";
import { RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/lib/theme";

import { createAppRouter } from "./router";

export function App() {
  const [router] = useState(createAppRouter);

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
