import { Navigate, createBrowserRouter } from "react-router-dom";

import { SiteShell } from "./layouts/site-shell";
import { HomePage } from "./routes/home";
import {
  LegacyComponentRedirect,
  LegacyExamplesRedirect,
  LegacyGuideRedirect,
  LegacyPatternRedirect
} from "./routes/legacy-redirects";
import { NotFoundPage } from "./routes/not-found";

export function createAppRouter() {
  return createBrowserRouter([
    {
      element: <SiteShell />,
      path: "/",
      children: [
        { element: <HomePage />, index: true },
        {
          element: <Navigate replace to={{ hash: "#install", pathname: "/" }} />,
          path: "docs/getting-started"
        },
        {
          element: <Navigate replace to={{ hash: "#component-button", pathname: "/" }} />,
          path: "docs/components"
        },
        {
          element: <Navigate replace to={{ hash: "#pattern-auth-forms", pathname: "/" }} />,
          path: "docs/blocks"
        },
        {
          element: <Navigate replace to={{ hash: "#install", pathname: "/" }} />,
          path: "guides"
        },
        { element: <LegacyGuideRedirect />, path: "guides/:slug" },
        {
          element: <Navigate replace to={{ hash: "#component-button", pathname: "/" }} />,
          path: "components"
        },
        { element: <LegacyComponentRedirect />, path: "components/:name" },
        {
          element: <Navigate replace to={{ hash: "#pattern-auth-forms", pathname: "/" }} />,
          path: "patterns"
        },
        { element: <LegacyPatternRedirect />, path: "patterns/:name" },
        { element: <LegacyExamplesRedirect />, path: "examples" },
        { element: <LegacyComponentRedirect />, path: "docs/components/:name" },
        { element: <LegacyPatternRedirect />, path: "docs/blocks/:name" },
        { element: <NotFoundPage />, path: "*" }
      ]
    }
  ]);
}
