import React from "react";
import { withForm } from "@/contexts/AdminFormContext";
import { ISourceAndKey, SetStateType } from "@/types/main.types";
import { defaultCreationData } from "./create-form.constants";

interface IProps extends ISourceAndKey {
   value: string[];
   setValue: SetStateType<string[]>;
   isPending?: boolean;
}

const CreateForm = withForm({
   defaultValues: defaultCreationData,
   props: {
      source: "",
      queryKey: "",
      value: [],
      setValue: () => {},
   } as IProps,
   render: function Render({ form, source, queryKey, value, setValue }) {
      return (
         <div>
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
   },
});

export default CreateForm;
