import SelectField from "@/components/UI/form/SelectField";
import SubmitButton from "@/components/UI/form/SubmitButton";
import { createFormHook, createFormHookContexts } from "@tanstack/react-form";

export const { fieldContext, formContext, useFieldContext, useFormContext } =
   createFormHookContexts();

export const { useAppForm, withForm } = createFormHook({
   fieldContext,
   formContext,
   fieldComponents: {
      SelectField,
   },
   formComponents: {
      SubmitButton,
   },
});
