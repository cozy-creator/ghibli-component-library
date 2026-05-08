import { THEME_FRAME_VARIANTS, ThemeFrame } from "@ghibli/ui";

export const brandLogoPath = "/brand/ghibli-logo.png";

type BrandMarkProps = {
  className?: string;
  imageClassName?: string;
};

export function BrandMark({
  className = "size-12 shrink-0",
  imageClassName,
}: BrandMarkProps) {
  return (
    <ThemeFrame
      className={className}
      contentClassName="p-1.5"
      surfaceClassName="bg-[color:var(--theme-shell-brand-background)]"
      strokeColor="var(--theme-shell-brand-border)"
      variant={THEME_FRAME_VARIANTS.shellBrandMark}
    >
      <img
        alt=""
        aria-hidden="true"
        className={`size-full object-contain${imageClassName ? ` ${imageClassName}` : ""}`}
        decoding="async"
        src={brandLogoPath}
      />
    </ThemeFrame>
  );
}
