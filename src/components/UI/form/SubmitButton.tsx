import React from "react";
import { toast } from "sonner";
import { Spinner } from "../lib-components/spinner";
import ActionButton from "../buttons/ActionButton";
import { useFormContext } from "@/contexts/AdminFormContext";

const SubmitButton = () => {
   const form = useFormContext();
   const submitForm = async () => {
      try {
         await form.handleSubmit();
         toast.success("Соревнование создано");
      } catch (err) {
         toast.error("Ошибка при создании формы");
         console.log(err);
      }
   };
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
               action={submitForm}
               disabled={!canSubmit || isPristine || isSubmitting}
               aria-disabled={!canSubmit || isPristine}
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
