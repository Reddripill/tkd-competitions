import React from "react";
import { Button, buttonVariants } from "./button";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface IProps
   extends React.ComponentProps<"button">,
      VariantProps<typeof buttonVariants> {
   action: () => void;
   children?: React.ReactNode;
   className?: string;
}

const ActionButton = ({ action, children, className, ...props }: IProps) => {
   return (
      <Button
         type="button"
         onClick={action}
         className={cn(
            "bg-blue-accent hover:bg-blue-accent/80 transition-colors text-white",
            className
         )}
         {...props}
      >
         <div>{children ? children : "Добавить"}</div>
      </Button>
   );
};

export default ActionButton;
