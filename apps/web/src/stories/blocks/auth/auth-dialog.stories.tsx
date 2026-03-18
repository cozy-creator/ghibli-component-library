import type { Meta, StoryObj } from "@storybook/react-vite";

import { AuthDialog, LoginForm, RegisterForm } from "@ghibli/ui";

const meta = {
  title: "Patterns/Auth/Auth Dialog"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <AuthDialog
      loginContent={<LoginForm email="" onEmailChange={() => undefined} onPasswordChange={() => undefined} password="" />}
      onOpenChange={() => undefined}
      open
      providerActions={[
        { id: "github", label: "GitHub" },
        { id: "discord", label: "Discord" }
      ]}
      registerContent={
        <RegisterForm
          confirmPassword=""
          email=""
          name=""
          onConfirmPasswordChange={() => undefined}
          onEmailChange={() => undefined}
          onNameChange={() => undefined}
          onPasswordChange={() => undefined}
          password=""
        />
      }
      showForgotPassword={false}
    />
  )
};
