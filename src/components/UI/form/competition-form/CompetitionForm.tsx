import React from "react";
import { withForm } from "@/contexts/AdminFormContext";
import { SetStateType } from "@/types/main.types";
import { defaultCreationCompData } from "./competition-form.contstants";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { API } from "@/constants/api";

interface IProps {
   disciplineValue: string;
   setDisciplineValue: SetStateType<string>;
   categoriesValue: string[];
   setCategoriesValue: SetStateType<string[]>;
}

const CompetitionForm = withForm({
   defaultValues: defaultCreationCompData,
   props: {
      disciplineValue: "",
      setDisciplineValue: () => {},
      categoriesValue: [],
      setCategoriesValue: () => {},
   } as IProps,
   render: function Render({
      form,
      disciplineValue,
      setDisciplineValue,
      categoriesValue,
      setCategoriesValue,
   }) {
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
                  <div className="flex flex-col gap-y-8">
                     <form.AppField name="discipline">
                        {field => {
                           return (
                              <field.SelectField
                                 isControlledInput={true}
                                 suggestion={true}
                                 value={disciplineValue}
                                 setValue={setDisciplineValue}
                                 isMulti={false}
                                 label="Название дисциплины *"
                                 source={API.DISCIPLINES}
                                 queryKey={QUERY_KEYS.TOURNAMENTS}
                                 size="default"
                              />
                           );
                        }}
                     </form.AppField>
                     <form.Subscribe
                        selector={state => state.values.categories}
                     >
                        {() => (
                           <form.AppField name="categories" mode="array">
                              {categoriesField => (
                                 <categoriesField.SelectField
                                    isControlledSelect={true}
                                    suggestion={true}
                                    selectedValues={categoriesValue}
                                    setSelectedValues={setCategoriesValue}
                                    isMulti={true}
                                    label="Название категорий"
                                    size="default"
                                    source={API.CATEGORIES}
                                    queryKey={QUERY_KEYS.TOURNAMENTS}
                                 />
                              )}
                           </form.AppField>
                        )}
                     </form.Subscribe>
                  </div>
               </form>
            </div>
         </div>
      );
   },
});

export default CompetitionForm;
