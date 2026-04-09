import type { Meta, StoryObj } from "@storybook/react-vite";

import { AuthDialog, LoginForm, RegisterForm } from "@ghibli/ui";

import {
  AppleAuthIcon,
  DiscordAuthIcon,
  GitHubAuthIcon,
  GoogleAuthIcon,
} from "@/apps/web/src/components/auth-provider-icons";

const meta = {
  title: "Patterns/Auth/Auth Dialog"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: () => (
    <AuthDialog
      loginContent={
        <LoginForm
          email=""
          onEmailChange={() => undefined}
          onPasswordChange={() => undefined}
          password=""
          providerActions={[
            { icon: <GoogleAuthIcon />, id: "google", label: "Google", onSelect: () => undefined },
            { icon: <GitHubAuthIcon />, id: "github", label: "GitHub", onSelect: () => undefined },
            { icon: <DiscordAuthIcon />, id: "discord", label: "Discord", onSelect: () => undefined },
            { icon: <AppleAuthIcon />, id: "apple", label: "Apple", onSelect: () => undefined }
          ]}
        />
      }
      onOpenChange={() => undefined}
      open
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
          providerActions={[
            { icon: <GoogleAuthIcon />, id: "google", label: "Google", onSelect: () => undefined },
            { icon: <GitHubAuthIcon />, id: "github", label: "GitHub", onSelect: () => undefined },
            { icon: <DiscordAuthIcon />, id: "discord", label: "Discord", onSelect: () => undefined },
            { icon: <AppleAuthIcon />, id: "apple", label: "Apple", onSelect: () => undefined }
          ]}
        />
      }
      showForgotPassword={false}
    />
  )
};
