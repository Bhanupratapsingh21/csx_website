import { Button, type ButtonProps } from "@once-ui-system/core";
import React from "react";

interface EditorButtonProps extends ButtonProps {
  active?: boolean;
  size?:  "s" | "m" | "l";
}

export const EditorButton = React.forwardRef<HTMLButtonElement, EditorButtonProps>(
  ({ active = false, size = "s", variant, ...props }, ref) => {
    // Map xs to s if your Button component doesn't support xs
    const mappedSize = size === "s" ? "m" : size;
    
    // Determine variant based on active state
    const buttonVariant = active ? "primary" : variant ?? "secondary";

    return (
      <Button
        ref={ref}
        size={mappedSize}
        variant={buttonVariant}
        {...props}
      />
    );
  }
);

EditorButton.displayName = "EditorButton";