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
    render(
      <GeneratePromptComposer
        attachments={[{ id: "mood", kind: "image", name: "moodboard.jpg", sizeLabel: "1.2 MB" }]}
        prompt="Cozy river cabin"
      />
    );

    expect(screen.getByDisplayValue("Cozy river cabin")).toBeInTheDocument();
    expect(screen.getByText("moodboard.jpg")).toBeInTheDocument();
    expect(screen.getByText("1.2 MB")).toBeInTheDocument();
  });
});
