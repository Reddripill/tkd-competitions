import React from "react";
import { Spinner } from "../lib-components/spinner";
import ActionButton from "../buttons/ActionButton";
import { useFormContext } from "@/contexts/AdminFormContext";

const SubmitButton = () => {
   const form = useFormContext();
   return (
      <form.Subscribe
         selector={state => [
            state.canSubmit,
            state.isSubmitting,
            state.isPristine,
         ]}
      >
         {([canSubmit, isSubmitting, isPristine]) => (
            <ActionButton
               className="rounded-lg text-lg h-12 w-[200px]"
               action={form.handleSubmit}
               disabled={!canSubmit || isPristine || isSubmitting}
               aria-disabled={!canSubmit || isPristine || isSubmitting}
            >
               {isSubmitting ? (
                  <div className="flex items-center gap-x-2">
                     <Spinner />
                     <div>Сохранение</div>
                  </div>
               ) : (
                  "Сохранить"
               )}
            </ActionButton>
         )}
      </form.Subscribe>
   );
};

export default SubmitButton;
