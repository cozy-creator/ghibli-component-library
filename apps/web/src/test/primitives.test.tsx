import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger, Button, Tabs, TabsContent, TabsList, TabsTrigger } from "@ghibli/ui";

describe("primitives", () => {
  it("renders buttons as buttons and links", () => {
    render(
      <div>
        <Button>Generate</Button>
        <Button asChild>
          <a href="/docs">Read docs</a>
        </Button>
      </div>
    );

    expect(screen.getByRole("button", { name: "Generate" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Read docs" })).toBeInTheDocument();
  });

  it("switches tabs content", async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="one">
        <TabsList>
          <TabsTrigger value="one">One</TabsTrigger>
          <TabsTrigger value="two">Two</TabsTrigger>
        </TabsList>
        <TabsContent value="one">First</TabsContent>
        <TabsContent value="two">Second</TabsContent>
      </Tabs>
    );

    expect(screen.getByText("First")).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "Two" }));
    expect(screen.getByRole("tab", { name: "Two" })).toHaveAttribute("data-state", "active");
  });

  it("opens accordion content after click", () => {
    render(
      <Accordion collapsible defaultValue="" type="single">
        <AccordionItem value="faq">
          <AccordionTrigger>Question</AccordionTrigger>
          <AccordionContent>Answer</AccordionContent>
        </AccordionItem>
      </Accordion>
    );

    fireEvent.click(screen.getByRole("button", { name: "Question" }));
    expect(screen.getByText("Answer")).toBeInTheDocument();
  });
});
