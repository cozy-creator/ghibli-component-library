import * as React from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HandDrawnFrame } from "@/components/ui/hand-drawn-frame";
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
  onOpenChange: (open: boolean) => void;
  onShowForgotPasswordChange?: (show: boolean) => void;
  onTabChange?: (tab: AuthDialogTab) => void;
  open: boolean;
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
  onTabChange,
  open,
  registerContent,
  showForgotPassword = false,
  tab = "login",
  title = "Welcome back",
}: AuthDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        style={
          {
            "--dialog-background": "transparent",
            "--dialog-border-color": "transparent",
            "--dialog-max-width": "28rem",
            "--dialog-padding": "0px",
          } as React.CSSProperties
        }
      >
        <HandDrawnFrame
          className="overflow-hidden"
          contentClassName="px-5 py-5"
          surfaceClassName="bg-[color:var(--card)]"
          strokeColor="var(--border)"
          strokeWidthRange={[1.45, 1.45]}
          svgClassName="opacity-70"
          crookedness={0.6}
        >
          <DialogHeader style={{ paddingRight: "2.5rem" }}>
            <DialogTitle>
              {showForgotPassword ? "Recover your password" : title}
            </DialogTitle>
          </DialogHeader>
          {showForgotPassword && forgotPasswordContent ? (
            forgotPasswordContent
          ) : (
            <div className="grid gap-4">
              <Tabs
                onValueChange={(value) => onTabChange?.(value as AuthDialogTab)}
                value={tab}
              >
                <TabsList style={{ width: "100%" }}>
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
            </div>
          )}
        </HandDrawnFrame>
      </DialogContent>
    </Dialog>
  );
}
