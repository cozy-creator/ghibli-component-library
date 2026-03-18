import type { Meta, StoryObj } from "@storybook/react-vite";

import { AccountChangeEmailDialog, AccountChangePasswordDialog } from "@ghibli/ui";

const meta = {
  title: "Patterns/Account/Account Dialogs"
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

export const ChangeEmailOpen: Story = {
  render: () => (
    <AccountChangeEmailDialog
      currentEmail="melina@ghibli-ui.dev"
      newEmail="melina@new.ghibli-ui.dev"
      onNewEmailChange={() => undefined}
      onOpenChange={() => undefined}
      open
    />
  )
};

export const ChangePasswordOpen: Story = {
  render: () => (
    <AccountChangePasswordDialog
      confirmPassword=""
      currentPassword=""
      newPassword=""
      onConfirmPasswordChange={() => undefined}
      onCurrentPasswordChange={() => undefined}
      onNewPasswordChange={() => undefined}
      onOpenChange={() => undefined}
      open
    />
  )
};
