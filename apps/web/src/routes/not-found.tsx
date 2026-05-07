import { Link } from "react-router-dom";

import { Button, HandDrawnFrame } from "@ghibli/ui";

import { PageIntro } from "@/apps/web/src/components/docs/page-intro";

export function NotFoundPage() {
  return (
    <div className="grid gap-6 py-10">
      <PageIntro
        badge="404"
        description="The requested page does not exist in the showcase app."
        title="Page not found"
      />
      <HandDrawnFrame
        className="w-fit"
        contentClassName="px-4 py-4"
        surfaceClassName="bg-[color:rgba(255,255,255,0.55)]"
        crookedness={0.6}
      >
        <div className="flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/">Return home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/#component-button">Browse components</Link>
          </Button>
        </div>
      </HandDrawnFrame>
    </div>
  );
}
