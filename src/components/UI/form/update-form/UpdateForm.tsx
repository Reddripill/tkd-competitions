import React from "react";
import { withForm } from "@/contexts/AdminFormContext";
import { ISourceAndKey } from "@/types/main.types";
import { defaultUpdateData } from "./update-form.constants";
import { Skeleton } from "../../lib-components/skeleton";

interface IProps extends ISourceAndKey {
   isPending?: boolean;
   initialValue?: string;
}

const UpdateForm = withForm({
   defaultValues: defaultUpdateData,
   props: {
      source: "",
      queryKey: "",
      initialValue: "",
      isPending: false,
   } as IProps,
   render: function Render({
      form,
      source,
      queryKey,
      isPending,
      initialValue,
   }) {
      return (
         <div>
            <form
               onSubmit={e => {
                  e.preventDefault();
                  e.stopPropagation();
               }}
               className="w-full"
            >
               {isPending ? (
                  <Skeleton className="w-full h-8" />
               ) : (
                  <form.AppField name="title">
                     {field => {
                        return (
                           <field.SelectField
                              initialValue={initialValue}
                              isMulti={false}
                              label="Название *"
                              source={source}
                              queryKey={queryKey}
                              size="default"
                           />
                        );
                     }}
                  </form.AppField>
               )}
            </form>
         </div>
      );
   },
});

export default UpdateForm;
