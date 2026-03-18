import { Link } from "react-router-dom";

import { Button } from "@ghibli/ui";

import { PageIntro } from "@/apps/web/src/components/docs/page-intro";

export function NotFoundPage() {
  return (
    <div className="docs-stack">
      <PageIntro
        badge="404"
        description="The requested page does not exist in the documentation app."
        title="Page not found"
      />
      <div className="docs-surface flex flex-wrap gap-3">
        <Button asChild>
          <Link to="/">Return home</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link to="/components">Browse components</Link>
        </Button>
      </div>
    </div>
  );
}
