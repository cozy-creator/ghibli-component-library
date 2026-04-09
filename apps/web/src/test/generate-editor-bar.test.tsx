import { fireEvent, render, screen } from "@testing-library/react";

import { GenerateEditorBar, GeneratePromptComposer } from "@ghibli/ui";

const modeOptions = [
  { label: "Image", value: "image" },
  { label: "Storyboard", value: "storyboard" }
];

const modelOptions = [
  { label: "Riverlight", value: "riverlight" },
  { label: "Lantern Mix", value: "lantern-mix" }
];

const aspectRatioOptions = [
  { label: "Portrait", value: "3:4" },
  { label: "Landscape", value: "16:9" }
];

describe("generate editor bar", () => {
  it("renders the prompt and triggers generate", () => {
    const handleGenerate = vi.fn();

    render(
      <GenerateEditorBar
        aspectRatio="3:4"
        aspectRatioOptions={aspectRatioOptions}
        attachments={[]}
        mode="image"
        modeOptions={modeOptions}
        model="riverlight"
        modelOptions={modelOptions}
        negativePrompt=""
        numImages={2}
        onGenerate={handleGenerate}
        prompt="Warm tea shop window at dusk"
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /generate/i }));
    expect(handleGenerate).toHaveBeenCalledTimes(1);
  });

  it("renders the prompt composer attachment surface", () => {
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
  });
});
