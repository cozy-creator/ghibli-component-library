import * as React from "react";

import { Button, type ButtonProps } from "./button";

export function LanternButton(props: Omit<ButtonProps, "variant">) {
  return <Button variant="lantern" {...props} />;
}
