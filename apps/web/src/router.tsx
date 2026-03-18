import { createBrowserRouter } from "react-router-dom";

import { SiteShell } from "./layouts/site-shell";
import { BlockDetailPage } from "./routes/docs/block-detail";
import { ComponentDetailPage } from "./routes/docs/component-detail";
import { GettingStartedPage } from "./routes/docs/getting-started";
import { ThemesPage } from "./routes/docs/themes";
import { HomePage } from "./routes/home";
import { CreatorGalleryMockupPage } from "./routes/mockups/creator-gallery";
import { KitchenSinkMockupPage } from "./routes/mockups/kitchen-sink";
import { PaperSaasMockupPage } from "./routes/mockups/paper-saas";
import { TravelDashboardMockupPage } from "./routes/mockups/travel-dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <SiteShell />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "docs/getting-started", element: <GettingStartedPage /> },
      { path: "docs/themes", element: <ThemesPage /> },
      { path: "docs/components/:name", element: <ComponentDetailPage /> },
      { path: "docs/blocks/:name", element: <BlockDetailPage /> },
      { path: "mockups/creator-gallery", element: <CreatorGalleryMockupPage /> },
      { path: "mockups/travel-dashboard", element: <TravelDashboardMockupPage /> },
      { path: "mockups/paper-saas", element: <PaperSaasMockupPage /> },
      { path: "mockups/kitchen-sink", element: <KitchenSinkMockupPage /> }
    ]
  }
]);

