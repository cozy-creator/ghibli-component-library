import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, Input, Label, Textarea } from "@ghibli/ui";

export function App() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-4 py-8 md:px-6">
      <section className="grid gap-4 rounded-[var(--radius)] border border-[color:var(--border)] bg-[color:rgba(252,247,237,0.84)] p-6 shadow-[var(--shadow-paper)]">
        <div className="flex flex-wrap items-center gap-3">
          <Badge tone="river">consumer example</Badge>
          <Badge tone="meadow">style installed</Badge>
        </div>
        <div className="grid gap-3">
          <h1 className="font-[var(--font-heading)] text-5xl leading-[0.96] text-[color:var(--ink-strong)]">
            Minimal consumer app
          </h1>
          <p className="max-w-[64ch] text-base leading-8 text-[color:var(--muted-foreground)]">
            This example shows the visual baseline you get after installing `@ghibli/style` plus a few copied components.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary action</Button>
        </div>
      </section>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
        <Card>
          <CardHeader>
            <CardTitle>Quick start</CardTitle>
            <CardDescription>Install the style item, then add only the pieces your app needs.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="rounded-[calc(var(--radius)-0.2rem)] border border-[color:var(--border)] bg-[color:var(--paper-soft)] px-4 py-3 text-sm text-[color:var(--ink-strong)]">
              pnpm dlx shadcn@latest add @ghibli/style
            </div>
            <div className="rounded-[calc(var(--radius)-0.2rem)] border border-[color:var(--border)] bg-[color:var(--paper-soft)] px-4 py-3 text-sm text-[color:var(--ink-strong)]">
              pnpm dlx shadcn@latest add @ghibli/button @ghibli/card @ghibli/input
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Feedback form</CardTitle>
            <CardDescription>Simple primitives compose into a usable surface immediately.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="project-name">Project name</Label>
              <Input id="project-name" placeholder="Moonlit atelier" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="project-notes">Notes</Label>
              <Textarea id="project-notes" defaultValue="Warm windows, layered paper shadows, and a gentle illustration tone." />
            </div>
            <Button>Send feedback</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
