import { ItemDirectory } from "@/apps/web/src/components/docs/item-directory";
import { componentDocs, componentFamilies } from "@/apps/web/src/data/library-docs";

export function ComponentsIndexPage() {
  return (
    <ItemDirectory
      description="Browse every installable primitive with search, family filters, preview cards, and a direct path to richer usage documentation."
      emptyMessage="No components matched that search. Try a different family or a broader query."
      families={componentFamilies}
      items={componentDocs}
      title="Components"
    />
  );
}
