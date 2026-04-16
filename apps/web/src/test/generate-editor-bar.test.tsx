import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  GenerateAspectRatioSelect,
  GenerateEditorBar,
  GenerateModelSelect,
  GeneratePromptComposer
} from "@ghibli/ui";

const modeOptions = [
  { label: "Image", value: "image" },
  { label: "Video", value: "video" }
];

const generateModelItems = [
  {
    baseModel: "Flux",
    description: "Highest quality",
    displayName: "Flux Dev",
    expectedTimeSec: 30,
    expertise: ["photo", "hyper-real", "classical-art"],
    name: "flux-dev",
    supportsVideo: true
  },
  {
    baseModel: "SDXL",
    description: "Anime specialist",
    displayName: "Pony V6",
    expectedTimeSec: 25,
    expertise: ["anime", "videogame", "physical-art"],
    name: "pony-v6",
    supportsVideo: false
  }
];

const modelsByBase = generateModelItems.reduce<Record<string, typeof generateModelItems>>(
  (accumulator, item) => {
    (accumulator[item.baseModel] ??= []).push(item);
    return accumulator;
  },
  {}
);

const aspectRatioOptions = [
  { description: "Ultra wide", label: "21:9", value: "21/9" },
  { description: "Landscape", label: "16:9", value: "16/9" },
  { description: "Wide", label: "4:3", value: "4/3" },
  { description: "Square", label: "1:1", value: "1/1" },
  { description: "Tall", label: "3:4", value: "3/4" },
  { description: "Portrait", label: "9:16", value: "9/16" },
  { description: "Ultra Tall", label: "9:21", value: "9/21" }
];

describe("generate editor surfaces", () => {
  it("renders the prompt and triggers generate", async () => {
    const user = userEvent.setup();
    const handleGenerate = vi.fn();

    render(
      <GenerateEditorBar
        aspectRatio="9/16"
        aspectRatioOptions={aspectRatioOptions}
        attachments={[]}
        mode="image"
        modeOptions={modeOptions}
        model="flux-dev"
        modelsByBase={modelsByBase}
        onGenerate={handleGenerate}
        prompt="Warm tea shop window at dusk"
        selectedModel={generateModelItems[0]}
      />
    );

    await user.click(screen.getByRole("button", { name: /generate/i }));
    expect(handleGenerate).toHaveBeenCalledTimes(1);
  });

  it("renders grouped model sections and expertise chips", async () => {
    const user = userEvent.setup();

    render(
      <GenerateModelSelect
        model="flux-dev"
        modelsByBase={modelsByBase}
        onChange={() => undefined}
        selectedModel={generateModelItems[0]}
      />
    );

    await user.click(screen.getByRole("button", { name: /flux dev/i }));

    expect(screen.getByText("Flux")).toBeInTheDocument();
    expect(screen.getByText("SDXL")).toBeInTheDocument();
    expect(screen.getAllByText("photo")[0]).toBeInTheDocument();
    expect(screen.getByText("Pony V6")).toBeInTheDocument();
  });

  it("opens the aspect ruler and selects portrait", async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <GenerateAspectRatioSelect
        onValueChange={handleChange}
        options={aspectRatioOptions}
        value="1/1"
      />
    );

    await user.click(screen.getByRole("button", { name: /1:1/i }));

    expect(screen.getByRole("button", { name: /21:9 ultra wide/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /9:16 portrait/i })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /9:16 portrait/i }));

    expect(handleChange).toHaveBeenCalledWith("9/16");
    expect(screen.getByText("(Portrait)")).toBeInTheDocument();
  });

  it("renders the prompt composer attachment surface and attachment menu", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <GeneratePromptComposer
        attachments={[
          {
            id: "mood",
            kind: "image",
            name: "moodboard.jpg",
            previewUrl:
              "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 10'><rect width='10' height='10' fill='%23d8b36a'/></svg>",
            sizeLabel: "1.2 MB"
          }
        ]}
        prompt="Riverside cabin at dusk"
      />
    );

    expect(screen.getByDisplayValue("Riverside cabin at dusk")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open attachment menu" })).toBeInTheDocument();
    expect(container.querySelector("img")).not.toBeNull();
    await user.click(screen.getByRole("button", { name: "Open attachment menu" }));
    expect(screen.getByText("Add photos or files")).toBeInTheDocument();
  });
});
