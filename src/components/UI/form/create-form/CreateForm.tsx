import React from "react";
import { useAppForm } from "@/contexts/AdminFormContext";
import { ISourceAndKey, SetStateType } from "@/types/main.types";
import { defaultCreationData } from "./create-form.constants";
import { Toaster } from "sonner";

interface IProps extends ISourceAndKey {
   value: string[];
   setValue: SetStateType<string[]>;
}

const CreateForm = ({ source, queryKey, value, setValue }: IProps) => {
   const form = useAppForm({
      defaultValues: defaultCreationData,
   });
   return (
      <div>
         <Toaster position="top-center" expand={true} richColors={true} />
         <div>
            <form
               onSubmit={e => {
                  e.preventDefault();
                  e.stopPropagation();
               }}
               className="w-full"
            >
               <form.AppField name="titles" mode="array">
                  {field => {
                     return (
                        <field.SelectField
                           isControlledSelect={true}
                           selectedValues={value}
                           setSelectedValues={setValue}
                           isMulti={true}
                           label="Название *"
                           source={source}
                           queryKey={queryKey}
                           size="default"
                        />
                     );
                  }}
               </form.AppField>
            </form>
         </div>
      </div>
   );
};

export default CreateForm;
