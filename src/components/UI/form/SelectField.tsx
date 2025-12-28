import React from "react";
import { useFieldContext } from "@/components/admin/screens/new-competition/NewCompetitionPage";
import InputAndSelect, { ISelectProps } from "../InputAndSelect";

const SelectField = (props: ISelectProps) => {
   const field = useFieldContext<string | string[]>();

   const isValid = field.state.meta.isValid || !field.state.meta.isTouched;

   const changeHandler = (value: string) => {
      if (Array.isArray(field.state.value)) {
         field.pushValue(value);
      } else {
         field.handleChange(value);
      }
   };

   const blurHandler = () => {
      field.handleBlur();
   };

   const unselectHandler = (val: string) => {
      if (Array.isArray(field.state.value)) {
         const index = field.state.value.findIndex(item => item === val);
         if (index !== -1) {
            field.removeValue(index);
         }
      }
   };

   return (
      <InputAndSelect
         isValid={isValid}
         changeHandler={changeHandler}
         blurHandler={blurHandler}
         unselectHandler={unselectHandler}
         validation={true}
         errorMessage={field.state.meta.errors[0]?.message}
         {...props}
      />
   );
};

export default SelectField;
