import * as React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion";

export interface FaqItem {
  answer: React.ReactNode;
  id: string;
  question: string;
}

export interface DocsFaqAccordionProps {
  items: FaqItem[];
}

export function DocsFaqAccordion({ items }: DocsFaqAccordionProps) {
  return (
    <Accordion
      className="grid gap-3"
      collapsible
      defaultValue={items[0] ? items[0].id : ""}
      type="single"
    >
      {items.map((item) => (
        <AccordionItem key={item.id} value={item.id}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
