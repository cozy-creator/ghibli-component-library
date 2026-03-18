import type { Meta, StoryObj } from "@storybook/react-vite";

import { GenerateJobCard } from "@ghibli/ui";

import { sampleJobs } from "@/apps/web/src/data/demo-fixtures";

const meta = {
  title: "Patterns/Generate/Generate Job Card"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-4">
      {sampleJobs.map((job, index) => (
        <GenerateJobCard
          key={index}
          outputs={job.outputs}
          progress={job.progress}
          prompt={job.prompt}
          status={job.status}
          subtitle={job.subtitle}
          title={job.title}
        />
      ))}
    </div>
  )
};
