import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Field({
  children
}: {
  children: React.ReactNode;
}) {
  return <div className="grid gap-2">{children}</div>;
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change email</DialogTitle>
          <DialogDescription>
            Keep the form small and predictable so the host app can add its own validation.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={onSubmit}>
          {currentEmail ? (
            <Field>
              <Label>Current email</Label>
              <Input disabled value={currentEmail} />
            </Field>
          ) : null}
          <Field>
            <Label>New email</Label>
            <Input
              onChange={(event) => onNewEmailChange(event.target.value)}
              placeholder="new-address@ghibli-ui.dev"
              type="email"
              value={newEmail}
            />
          </Field>
          <DialogFooter>
            <Button type="submit">{submitting ? "Saving..." : "Save email"}</Button>
          </DialogFooter>
        </form>
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change password</DialogTitle>
          <DialogDescription>
            A simple presentational password dialog with no embedded policy assumptions.
          </DialogDescription>
        </DialogHeader>
        <form className="grid gap-4" onSubmit={onSubmit}>
          <Field>
            <Label>Current password</Label>
            <Input
              onChange={(event) => onCurrentPasswordChange(event.target.value)}
              type="password"
              value={currentPassword}
            />
          </Field>
          <Field>
            <Label>New password</Label>
            <Input
              onChange={(event) => onNewPasswordChange(event.target.value)}
              type="password"
              value={newPassword}
            />
          </Field>
          <Field>
            <Label>Confirm password</Label>
            <Input
              onChange={(event) => onConfirmPasswordChange(event.target.value)}
              type="password"
              value={confirmPassword}
            />
          </Field>
          <DialogFooter>
            <Button type="submit">{submitting ? "Saving..." : "Save password"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
