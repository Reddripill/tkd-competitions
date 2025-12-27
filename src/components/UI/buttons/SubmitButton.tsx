import React from "react";
import { useFormContext } from "@/components/admin/screens/new-competition/NewCompetitionPage";
import { toast } from "sonner";
import ActionButton from "./ActionButton";
import { Spinner } from "../lib-components/spinner";

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
