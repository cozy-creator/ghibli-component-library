import { Navigate, createBrowserRouter } from "react-router-dom";

import { SiteShell } from "./layouts/site-shell";
import { ComponentsIndexPage } from "./routes/components";
import { BlockDetailPage } from "./routes/docs/block-detail";
import { ComponentDetailPage } from "./routes/docs/component-detail";
import { ExamplesPage } from "./routes/examples";
import { GuideDetailPage } from "./routes/guides/guide-detail";
import { HomePage } from "./routes/home";
import { LegacyComponentRedirect, LegacyPatternRedirect } from "./routes/legacy-redirects";
import { NotFoundPage } from "./routes/not-found";
import { PatternsIndexPage } from "./routes/patterns";

export function createAppRouter() {
  return createBrowserRouter([
    {
      element: <SiteShell />,
      path: "/",
      children: [
        { element: <HomePage />, index: true },
        { element: <Navigate replace to="/guides/getting-started" />, path: "docs/getting-started" },
        { element: <Navigate replace to="/components" />, path: "docs/components" },
        { element: <Navigate replace to="/patterns" />, path: "docs/blocks" },
        { element: <Navigate replace to="/guides/getting-started" />, path: "guides" },
        { element: <GuideDetailPage />, path: "guides/:slug" },
        { element: <ComponentsIndexPage />, path: "components" },
        { element: <ComponentDetailPage />, path: "components/:name" },
        { element: <PatternsIndexPage />, path: "patterns" },
        { element: <BlockDetailPage />, path: "patterns/:name" },
        { element: <ExamplesPage />, path: "examples" },
        { element: <LegacyComponentRedirect />, path: "docs/components/:name" },
        { element: <LegacyPatternRedirect />, path: "docs/blocks/:name" },
        { element: <NotFoundPage />, path: "*" }
      ]
    }
  ]);
}
