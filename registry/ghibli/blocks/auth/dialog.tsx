import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type AuthDialogTab = "login" | "register";

export interface AuthProviderAction {
  icon?: React.ReactNode;
  id: string;
  label: string;
  onSelect?: () => void;
}

export interface AuthDialogProps {
  forgotPasswordContent?: React.ReactNode;
  loginContent: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onShowForgotPasswordChange?: (show: boolean) => void;
  onTabChange?: (tab: AuthDialogTab) => void;
  providerActions?: AuthProviderAction[];
  registerContent: React.ReactNode;
  showForgotPassword?: boolean;
  tab?: AuthDialogTab;
  title?: string;
}

export function AuthDialog({
  forgotPasswordContent,
  loginContent,
  onOpenChange,
  onShowForgotPasswordChange,
  onTabChange,
  open,
  providerActions = [],
  registerContent,
  showForgotPassword = false,
  tab = "login",
  title = "Welcome back"
}: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[40rem]">
        <DialogHeader>
          <DialogTitle>{showForgotPassword ? "Recover your password" : title}</DialogTitle>
        </DialogHeader>
        {showForgotPassword && forgotPasswordContent ? (
          forgotPasswordContent
        ) : (
          <div className="grid gap-4">
            <Tabs onValueChange={(value) => onTabChange?.(value as AuthDialogTab)} value={tab}>
              <TabsList className="w-full">
                <TabsTrigger className="flex-1" value="login">
                  Sign in
                </TabsTrigger>
                <TabsTrigger className="flex-1" value="register">
                  Register
                </TabsTrigger>
              </TabsList>
              <TabsContent value="login">{loginContent}</TabsContent>
              <TabsContent value="register">{registerContent}</TabsContent>
            </Tabs>
            {providerActions.length > 0 ? (
              <>
                <div className="flex items-center gap-3">
                  <Separator className="flex-1" />
                  <span className="text-xs uppercase tracking-[0.18em] text-[color:var(--muted-foreground)]">
                    Or continue with
                  </span>
                  <Separator className="flex-1" />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">
                  {providerActions.map((provider) => (
                    <button
                      className="flex items-center justify-center gap-2 rounded-[calc(var(--radius)-0.35rem)] border border-[color:var(--border)] bg-[color:var(--paper-soft)] px-3 py-2 text-sm transition-colors hover:bg-white/50"
                      key={provider.id}
                      onClick={() => provider.onSelect?.()}
                      type="button"
                    >
                      {provider.icon}
                      {provider.label}
                    </button>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
