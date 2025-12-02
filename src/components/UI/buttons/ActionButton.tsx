import React from "react";
import Link from "next/link";
import { Button, ButtonProps } from "@chakra-ui/react";
import cn from "classnames";

interface ICommonProps {
   children: React.ReactNode;
   className?: string;
}

interface IButtonProps extends ICommonProps {
   action: () => void;
}

interface ILinkProps extends ICommonProps {
   link: string;
}

const baseConfig: ButtonProps = {
   size: "xl",
   rounded: "lg",
};

export const ActionButton = ({ children, action, className }: IButtonProps) => {
   return (
      <Button className={cn(className)} onClick={action} {...baseConfig}>
         {children}
      </Button>
   );
};

export const ActionButtonLink = ({ children, link, className }: ILinkProps) => {
   return (
      <Button className={cn(className)} asChild={true} {...baseConfig}>
         <Link href={link}>{children}</Link>
      </Button>
   );
};
