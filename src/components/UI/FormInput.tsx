"use client";
import React from "react";
import { Field, FieldLabel } from "./lib-components/field";
import { Input } from "./lib-components/input";
import { cn } from "@/lib/utils";

interface IProps extends React.ComponentProps<"input"> {
   isValid: boolean;
   message?: string;
   label?: string;
}

const FormInput = ({
   isValid,
   className,
   message,
   label,
   ...props
}: IProps) => {
   return (
      <div className={cn(className)}>
         <Field>
            {label && (
               <FieldLabel
                  htmlFor={props.id}
                  className={cn({
                     "text-red-accent": !isValid,
                  })}
               >
                  {label}
               </FieldLabel>
            )}
            <Input
               {...props}
               className={cn("h-10", {
                  "border-red-accent focus-visible:border-red-accent focus-visible:ring-red-accent/80":
                     !isValid,
               })}
               autoComplete="off"
            />
         </Field>
         {!isValid && message && (
            <em role="alert" className="text-red-accent text-sm">
               {message}
            </em>
         )}
      </div>
   );
};

export default FormInput;
