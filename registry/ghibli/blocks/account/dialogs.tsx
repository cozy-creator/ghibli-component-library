import * as React from "react";

import { CartoonButton } from "@/components/ui/cartoon-button";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Field({
  children
}: {
  children: React.ReactNode;
}) {
  return <div className="space-y-1.5">{children}</div>;
}

export interface AccountChangeEmailDialogProps {
  currentEmail?: string;
  newEmail: string;
  onNewEmailChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  open: boolean;
  submitting?: boolean;
}

export function AccountChangeEmailDialog({
  currentEmail,
  newEmail,
  onNewEmailChange,
  onOpenChange,
  onSubmit,
  open,
  submitting
}: AccountChangeEmailDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        aria-describedby={undefined}
        style={
          {
            "--dialog-background": "transparent",
            "--dialog-border-color": "transparent",
            "--dialog-max-width": "24rem",
            "--dialog-padding": "0px"
          } as React.CSSProperties
        }
      >
        <HandDrawnFrame
          className="overflow-hidden bg-[color:var(--card)] px-5 py-5"
          shape="card"
          strokeColor="var(--border)"
          strokeWidth={1.45}
          svgClassName="opacity-70"
          variant={0.6}
        >
          <DialogHeader className="pr-10">
            <DialogTitle>Change email</DialogTitle>
          </DialogHeader>
          <form className="space-y-4 pt-2" onSubmit={onSubmit}>
            {currentEmail ? (
              <Field>
                <Label>Current email</Label>
                <Input className="bg-background" disabled value={currentEmail} />
              </Field>
            ) : null}
            <Field>
              <Label>New email</Label>
              <Input
                className="bg-background"
                onChange={(event) => onNewEmailChange(event.target.value)}
                placeholder="new-address@ghibli-ui.dev"
                type="email"
                value={newEmail}
              />
            </Field>
            <div className="flex items-center gap-3 pt-1">
              <CartoonButton
                className="min-w-[10rem] justify-center"
                color="var(--success)"
                loading={Boolean(submitting)}
                loadingText="Saving..."
                size="sm"
                text="Save email"
                type="submit"
              />
              <Button onClick={() => onOpenChange(false)} size="sm" type="button" variant="ghost">
                Cancel
              </Button>
            </div>
          </form>
        </HandDrawnFrame>
      </DialogContent>
    </Dialog>
  );
}

export interface AccountChangePasswordDialogProps {
  confirmPassword: string;
  currentPassword: string;
  newPassword: string;
  onConfirmPasswordChange: (value: string) => void;
  onCurrentPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void;
  open: boolean;
  submitting?: boolean;
}

export function AccountChangePasswordDialog({
  confirmPassword,
  currentPassword,
  newPassword,
  onConfirmPasswordChange,
  onCurrentPasswordChange,
  onNewPasswordChange,
  onOpenChange,
  onSubmit,
  open,
  submitting
}: AccountChangePasswordDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        aria-describedby={undefined}
        style={
          {
            "--dialog-background": "transparent",
            "--dialog-border-color": "transparent",
            "--dialog-max-width": "24rem",
            "--dialog-padding": "0px"
          } as React.CSSProperties
        }
      >
        <HandDrawnFrame
          className="overflow-hidden bg-[color:var(--card)] px-5 py-5"
          shape="card"
          strokeColor="var(--border)"
          strokeWidth={1.45}
          svgClassName="opacity-70"
          variant={0.6}
        >
          <DialogHeader className="pr-10">
            <DialogTitle>Change password</DialogTitle>
          </DialogHeader>
          <form className="space-y-4 pt-2" onSubmit={onSubmit}>
            <Field>
              <Label>Current password</Label>
              <Input
                className="bg-background"
                onChange={(event) => onCurrentPasswordChange(event.target.value)}
                placeholder="••••••••"
                type="password"
                value={currentPassword}
              />
            </Field>
            <Field>
              <Label>New password</Label>
              <Input
                className="bg-background"
                onChange={(event) => onNewPasswordChange(event.target.value)}
                placeholder="Min. 8 characters"
                type="password"
                value={newPassword}
              />
            </Field>
            <Field>
              <Label>Confirm password</Label>
              <Input
                className="bg-background"
                onChange={(event) => onConfirmPasswordChange(event.target.value)}
                placeholder="••••••••"
                type="password"
                value={confirmPassword}
              />
            </Field>
            <div className="flex items-center gap-3 pt-1">
              <CartoonButton
                className="min-w-[10rem] justify-center"
                color="var(--success)"
                loading={Boolean(submitting)}
                loadingText="Saving..."
                size="sm"
                text="Save password"
                type="submit"
              />
              <Button onClick={() => onOpenChange(false)} size="sm" type="button" variant="ghost">
                Cancel
              </Button>
            </div>
          </form>
        </HandDrawnFrame>
      </DialogContent>
    </Dialog>
  );
}
