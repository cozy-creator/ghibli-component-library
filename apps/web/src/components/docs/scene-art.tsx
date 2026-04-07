import { cn } from "@ghibli/ui";

type SceneVariant =
  | "coast"
  | "forest"
  | "gallery"
  | "meadow"
  | "mountain"
  | "studio"
  | "sunset";

export interface SceneArtProps {
  className?: string;
  label?: string;
  variant: SceneVariant;
}

const sceneThemes: Record<
  SceneVariant,
  {
    mountain: string;
    sky: string;
    sun: string;
    tree: string;
    ground: string;
  }
> = {
  coast: {
    mountain: "#7092a0",
    sky: "linear-gradient(180deg,#a8d6eb,#f9f6df 60%,#8cb59b)",
    sun: "#f4c77c",
    tree: "#6e8a56",
    ground: "#87b8c8"
  },
  forest: {
    mountain: "#5f7961",
    sky: "linear-gradient(180deg,#c4e0d1,#fbf5df 50%,#8aab77)",
    sun: "#e4bd68",
    tree: "#65814c",
    ground: "#7a9f63"
  },
  gallery: {
    mountain: "#86b7c3",
    sky: "linear-gradient(180deg,#b4d4e4,#faf1d8 58%,#d8b57a)",
    sun: "#eca96d",
    tree: "#ae7862",
    ground: "#87b16d"
  },
  meadow: {
    mountain: "#6d8e77",
    sky: "linear-gradient(180deg,#9fcee4,#fff2d9 58%,#88b26d)",
    sun: "#f1c06f",
    tree: "#6f9151",
    ground: "#98bb72"
  },
  mountain: {
    mountain: "#74869a",
    sky: "linear-gradient(180deg,#9ec4dd,#f7f3df 62%,#7e9d75)",
    sun: "#eccf8a",
    tree: "#6a8250",
    ground: "#9ac2d7"
  },
  studio: {
    mountain: "#8e7a63",
    sky: "linear-gradient(180deg,#95b6ca,#f8eed7 60%,#c89d72)",
    sun: "#dca368",
    tree: "#7d6b56",
    ground: "#bb8a62"
  },
  sunset: {
    mountain: "#695768",
    sky: "linear-gradient(180deg,#9daccf,#f7d8ab 55%,#7f6d56)",
    sun: "#ef9d64",
    tree: "#6b6d52",
    ground: "#7b8e61"
  }
};

export function SceneArt({ className, label, variant }: SceneArtProps) {
  const theme = sceneThemes[variant];

  return (
    <div className={cn("story-scene relative overflow-hidden", className)} style={{ background: theme.sky }}>
      <div
        className="absolute left-[8%] top-[14%] size-14 rounded-full blur-sm"
        style={{ background: theme.sun }}
      />
      <div
        className="absolute inset-x-[-10%] bottom-[30%] h-[32%] rounded-[50%]"
        style={{ background: theme.mountain, opacity: 0.75 }}
      />
      <div
        className="absolute inset-x-[-4%] bottom-[18%] h-[26%] rounded-[50%]"
        style={{ background: theme.tree, opacity: 0.92 }}
      />
      <div
        className="absolute inset-x-[-8%] bottom-[-8%] h-[28%] rounded-[40%]"
        style={{ background: theme.ground }}
      />
      <div className="absolute left-[12%] top-[18%] h-4 w-16 rounded-full bg-white/55 blur-sm" />
      <div className="absolute right-[12%] top-[24%] h-5 w-20 rounded-full bg-white/50 blur-sm" />
      <div className="absolute bottom-[16%] left-[16%] h-28 w-3 rounded-full bg-[#6b573d]" />
      <div className="absolute bottom-[27%] left-[12%] h-12 w-14 rounded-full bg-[#67834c]" />
      <div className="absolute bottom-[18%] right-[16%] h-24 w-3 rounded-full bg-[#6b573d]" />
      <div className="absolute bottom-[26%] right-[11%] h-10 w-16 rounded-full bg-[#6c8951]" />
      <div className="floating-leaf absolute right-[10%] top-[12%] h-4 w-7 rounded-full bg-[#789c57]/80" />
      {label ? (
        <div className="absolute bottom-3 left-3 rounded-full border border-white/55 bg-white/55 px-3 py-1 text-xs tracking-[0.12em] uppercase text-[color:var(--ink-strong)] backdrop-blur-sm">
          {label}
        </div>
      ) : null}
    </div>
  );
}
