import React from "react";
import { Button, buttonVariants } from "./button";
import { VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

interface IProps
   extends React.ComponentProps<"button">,
      VariantProps<typeof buttonVariants> {
   action?: () => void;
   children?: React.ReactNode;
   className?: string;
   btnType?: "delete" | "basic" | "blue";
}

const ActionButton = ({
   action,
   children,
   className,
   btnType = "blue",
   ...props
}: IProps) => {
   return (
      <Button
         type="button"
         onClick={action}
         className={cn(
            " transition-colors text-white",
            { "bg-blue-accent hover:bg-blue-accent/80": btnType === "blue" },
            { "bg-red-accent hover:bg-red-accent/80": btnType === "delete" },
            {
               "bg-transparent border border-gray text-black":
                  btnType === "basic",
            },
            className
         )}
         {...props}
      >
         <div>{children ? children : "Добавить"}</div>
      </Button>
   );
};

export default ActionButton;
