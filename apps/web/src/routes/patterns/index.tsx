import { ItemDirectory } from "@/apps/web/src/components/docs/item-directory";
import { patternDocs, patternFamilies } from "@/apps/web/src/data/library-docs";

export function PatternsIndexPage() {
  return (
    <ItemDirectory
      description="Browse grouped installable patterns without turning the library into a full template pack. Each page explains exports, composition, and related primitives."
      emptyMessage="No patterns matched that search. Try a different family or a broader query."
      families={patternFamilies}
      items={patternDocs}
      title="Patterns"
    />
  );
}
