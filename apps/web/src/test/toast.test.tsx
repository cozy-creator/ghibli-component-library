import { act, render, screen } from "@testing-library/react";

import { Toaster, toast } from "@ghibli/ui";

describe("toast", () => {
  it("renders a dispatched success notification", async () => {
    render(<Toaster />);

    act(() => {
      toast.success("Saved changes.", { title: "Success" });
    });

    expect(await screen.findByText("Success")).toBeInTheDocument();
    expect(screen.getByText("Saved changes.")).toBeInTheDocument();
  });
});
