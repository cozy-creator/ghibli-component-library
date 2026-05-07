import { useState } from "react";
import { RouterProvider } from "react-router-dom";

import { ThemeProvider } from "@/lib/theme";
import { Toaster } from "@/components/ui/toast";

import { createAppRouter } from "./router";

export function App() {
  const [router] = useState(createAppRouter);

  return (
    <ThemeProvider>
      <RouterProvider router={router} />
      <Toaster />
    </ThemeProvider>
  );
}
