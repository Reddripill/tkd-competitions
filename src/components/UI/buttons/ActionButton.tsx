import React from "react";
import { Button, buttonVariants } from "./button";
import { VariantProps } from "class-variance-authority";

interface IProps
   extends React.ComponentProps<"button">,
      VariantProps<typeof buttonVariants> {
   action: () => void;
}

const ActionButton = ({ action, ...props }: IProps) => {
   return (
      <Button
         type="button"
         onClick={action}
         className="bg-blue-accent hover:bg-blue-accent/80 transition-colors text-white"
         {...props}
      >
         <div>Добавить</div>
      </Button>
   );
};

export default ActionButton;
