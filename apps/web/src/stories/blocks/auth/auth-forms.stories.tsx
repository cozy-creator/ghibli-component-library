import type { Meta, StoryObj } from "@storybook/react-vite";

import {
  ForgotPasswordForm,
  LoginForm,
  RegisterForm,
} from "@/cozy-examples/auth/forms";

const meta = {
  title: "Patterns/Auth/Auth Forms"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <div className="grid gap-6 lg:grid-cols-3">
      <LoginForm email="" onEmailChange={() => undefined} onPasswordChange={() => undefined} password="" />
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
      <ForgotPasswordForm email="" onEmailChange={() => undefined} />
    </div>
  )
};
