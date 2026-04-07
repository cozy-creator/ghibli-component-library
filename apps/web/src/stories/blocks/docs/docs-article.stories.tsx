import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  DocsArticle,
  DocsCallout,
  DocsCodeBlock,
  DocsH2,
  DocsParagraph
} from "@ghibli/ui";

const meta = {
  title: "Patterns/Docs/Docs Article"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <DocsArticle>
      <DocsH2>Install once, customize locally</DocsH2>
      <DocsParagraph>
        The registry copies source into your app, so the library is designed for ownership rather than opaque package consumption.
      </DocsParagraph>
      <DocsCallout>Install the style item before primitives or blocks.</DocsCallout>
      <DocsCodeBlock>{`pnpm dlx shadcn@latest add @ghibli/style`}</DocsCodeBlock>
    </DocsArticle>
  )
};
