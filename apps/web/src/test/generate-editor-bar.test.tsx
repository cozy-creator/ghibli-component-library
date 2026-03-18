import { fireEvent, render, screen } from "@testing-library/react";

import { GenerateEditorBar } from "@ghibli/ui";

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
});
