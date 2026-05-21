import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";

import { Tabs, TabsContent, TabsSwitch } from "@ghibli/ui";

describe("tabs switch", () => {
  it("renders a custom list of items and switches content", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="sketches">
        <TabsSwitch
          tabs={[
            { label: "Sketches", value: "sketches" },
            { label: "Final Frames", value: "final-frames" },
            { label: "Notes", value: "notes" },
          ]}
        />
        <TabsContent value="sketches">Sketches content</TabsContent>
        <TabsContent value="final-frames">Final frames content</TabsContent>
        <TabsContent value="notes">Notes content</TabsContent>
      </Tabs>,
    );

    expect(screen.getByRole("tab", { name: "Sketches" })).toHaveAttribute(
      "data-state",
      "active",
    );

    await user.click(screen.getByRole("tab", { name: "Final Frames" }));

    expect(screen.getByRole("tab", { name: "Final Frames" })).toHaveAttribute(
      "data-state",
      "active",
    );
    expect(screen.getByText("Final frames content")).toBeInTheDocument();
  });

  it("honors disabled items without changing the active tab", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="updates">
        <TabsSwitch
          tabs={[
            { label: "Updates", value: "updates" },
            { disabled: true, label: "Media", value: "media" },
            { label: "Social", value: "social" },
          ]}
        />
        <TabsContent value="updates">Updates content</TabsContent>
        <TabsContent value="media">Media content</TabsContent>
        <TabsContent value="social">Social content</TabsContent>
      </Tabs>,
    );

    const disabledTab = screen.getByRole("tab", { name: "Media" });

    expect(disabledTab).toBeDisabled();

    await user.click(disabledTab);

    expect(screen.getByRole("tab", { name: "Updates" })).toHaveAttribute(
      "data-state",
      "active",
    );
    expect(disabledTab).toHaveAttribute("data-state", "inactive");
  });

  it("stays in sync with the parent tabs root when the value changes externally", async () => {
    const user = userEvent.setup();

    function ControlledTabsSwitch() {
      const [value, setValue] = useState("updates");

      return (
        <div>
          <button onClick={() => setValue("social")} type="button">
            Show posts
          </button>
          <Tabs onValueChange={setValue} value={value}>
            <TabsSwitch
              tabs={[
                { label: "Updates", value: "updates" },
                { label: "Media", value: "media" },
                { label: "Social", value: "social" },
              ]}
            />
            <TabsContent value="updates">Updates content</TabsContent>
            <TabsContent value="media">Media content</TabsContent>
            <TabsContent value="social">Social content</TabsContent>
          </Tabs>
        </div>
      );
    }

    render(<ControlledTabsSwitch />);

    expect(screen.getByRole("tab", { name: "Updates" })).toHaveAttribute(
      "data-state",
      "active",
    );

    await user.click(screen.getByRole("button", { name: "Show posts" }));

    expect(screen.getByRole("tab", { name: "Social" })).toHaveAttribute(
      "data-state",
      "active",
    );
    expect(screen.getByText("Social content")).toBeInTheDocument();
  });
});
