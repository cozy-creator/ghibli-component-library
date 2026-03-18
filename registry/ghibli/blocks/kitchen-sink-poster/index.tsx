import * as React from "react";

import { Badge } from "../../ui/badge";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { Input } from "../../ui/input";
import { PaperPanel } from "../../ui/paper-panel";
import { ProgressPill } from "../../ui/progress-pill";
import { RadioGroup, RadioGroupItem } from "../../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import { Switch } from "../../ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { Textarea } from "../../ui/textarea";

export interface KitchenSinkPosterProps {
  title?: string;
}

export function KitchenSinkPoster({
  title = "Ghibli UI Components Kitchen Sink"
}: KitchenSinkPosterProps) {
  return (
    <PaperPanel className="grid gap-6 p-6">
      <div className="grid gap-2">
        <Badge variant="stamp">Kitchen Sink</Badge>
        <h2 className="font-[var(--font-heading)] text-4xl text-[color:var(--ink-strong)]">
          {title}
        </h2>
      </div>
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4 rounded-[calc(var(--radius)+0.5rem)] border border-[color:var(--border-strong)] bg-[color:var(--paper)] p-4">
          <div className="flex flex-wrap gap-3">
            <Button>Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
          </div>
          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 text-sm">
              <Checkbox defaultChecked />
              Checkbox
            </label>
            <label className="inline-flex items-center gap-2 text-sm">
              <Switch defaultChecked />
              Switch
            </label>
          </div>
          <Tabs defaultValue="tab-1">
            <TabsList>
              <TabsTrigger value="tab-1">Tab 1</TabsTrigger>
              <TabsTrigger value="tab-2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="tab-1">
              <div className="grid gap-4">
                <Input defaultValue="storybook@ghibli.ui" />
                <Select defaultValue="day">
                  <SelectTrigger>
                    <SelectValue placeholder="Select cadence" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Daily</SelectItem>
                    <SelectItem value="week">Weekly</SelectItem>
                    <SelectItem value="month">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>
            <TabsContent value="tab-2">
              <Textarea defaultValue="Modal copy, project notes, or travel journal snippets." />
            </TabsContent>
          </Tabs>
        </div>
        <div className="grid gap-4 rounded-[calc(var(--radius)+0.5rem)] border border-[color:var(--border-strong)] bg-[color:var(--card)] p-4">
          <div className="grid gap-3">
            <p className="text-sm tracking-[0.16em] uppercase text-[color:var(--muted-foreground)]">
              Radio
            </p>
            <RadioGroup defaultValue="date" className="gap-2">
              <label className="inline-flex items-center gap-3 text-sm">
                <RadioGroupItem value="radio" />
                Radio
              </label>
              <label className="inline-flex items-center gap-3 text-sm">
                <RadioGroupItem value="date" />
                Date
              </label>
            </RadioGroup>
          </div>
          <div className="grid gap-3">
            <p className="text-sm tracking-[0.16em] uppercase text-[color:var(--muted-foreground)]">
              Progress
            </p>
            <ProgressPill value={72} />
          </div>
          <div className="rounded-[calc(var(--radius)+0.375rem)] border border-[color:var(--border)] bg-[color:var(--paper)] p-4">
            <h3 className="font-[var(--font-heading)] text-2xl text-[color:var(--ink-strong)]">
              Modal
            </h3>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted-foreground)]">
              A single poster-like composition can preview the primitive set without becoming a generic dashboard.
            </p>
            <div className="mt-4 flex justify-end">
              <Button variant="secondary">OK</Button>
            </div>
          </div>
        </div>
      </div>
    </PaperPanel>
  );
}
