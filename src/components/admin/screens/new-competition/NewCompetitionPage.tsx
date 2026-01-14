"use client";
import React from "react";
import MainBlock from "../../MainBlock";
import { FieldGroup } from "@/components/UI/lib-components/field";
import { API } from "@/constants/api";
import { newCompetitionSchema } from "./new-competition.schema";
import { defaultCompetition } from "./new-competition.constants";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { toast } from "sonner";
import { useAppForm } from "@/contexts/AdminFormContext";
import AddFieldButton from "@/components/UI/form/AddFieldButton";
import { useMutation } from "@tanstack/react-query";
import { ICompetition } from "./new-competition.types";

const NewCompetitionPage = () => {
   const mutation = useMutation({
      mutationFn: async (body: ICompetition) => {
         const res = await fetch(API.COMPETITIONS, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               tournamentTitle: body.tournamentTitle,
               arenas: body.arenas,
            }),
         });

         if (!res.ok) {
            throw new Error("Ошибка при создании");
         }

         return res.json();
      },

      onSuccess: () => {
         toast.success("Соревнования успешно созданы");
         /* queryClient.invalidateQueries({
            queryKey: [queryKey],
         }); */
      },

      onError: () => {
         toast.error("Ошибка при создании");
      },
   });
   const form = useAppForm({
      defaultValues: defaultCompetition,
      onSubmit: ({ value }) => {
         mutation.mutate(value);
      },
      validators: {
         onChange: newCompetitionSchema,
         onBlur: newCompetitionSchema,
      },
   });
   return (
      <MainBlock title="Создание нового соревнования">
         <div className="flex justify-between gap-x-24 w-full">
            <form
               onSubmit={e => {
                  e.preventDefault();
                  e.stopPropagation();
               }}
               className="w-full"
            >
               <FieldGroup className="flex flex-col gap-y-10">
                  <form.AppField name="tournamentTitle">
                     {field => {
                        return (
                           <div className="border p-8 rounded-lg border-border-gray shadow-border">
                              <field.SelectField
                                 isMulti={false}
                                 label="Название соревнования *"
                                 source={API.TOURNAMENTS}
                                 queryKey={QUERY_KEYS.TOURNAMENTS}
                              />
                           </div>
                        );
                     }}
                  </form.AppField>
                  <form.Field name="arenas" mode="array">
                     {fieldArr => (
                        <div className="flex flex-col gap-y-10">
                           {fieldArr.state.value.map((_, index) => (
                              <div
                                 key={index}
                                 className="flex flex-col gap-y-8 py-8 rounded-lg border-border-gray shadow-border"
                              >
                                 <form.AppField
                                    name={`arenas[${index}].arenaTitle`}
                                 >
                                    {field => (
                                       <div className="px-8 pb-8 border-b border-border">
                                          <field.SelectField
                                             isMulti={false}
                                             label="Название арены *"
                                             source={API.CATEGORIES}
                                          />
                                       </div>
                                    )}
                                 </form.AppField>
                                 <form.Field
                                    name={`arenas[${index}].info`}
                                    mode="array"
                                 >
                                    {subFieldArr => (
                                       <div className="mb-4">
                                          <div className="mb-6">
                                             {subFieldArr.state.value.map(
                                                (_, subIndex) => (
                                                   <div
                                                      className="flex flex-col gap-y-6 px-8 pt-8 pb-8 first:pt-0 last:pb-0 last:border-none border-b border-border"
                                                      key={subIndex}
                                                   >
                                                      <form.AppField
                                                         name={`arenas[${index}].info[${subIndex}].discipline`}
                                                      >
                                                         {disciplineField => (
                                                            <disciplineField.SelectField
                                                               source={
                                                                  API.DISCIPLINES
                                                               }
                                                               queryKey={
                                                                  QUERY_KEYS.DISCIPLINES
                                                               }
                                                               label="Название дисциплины"
                                                               isMulti={false}
                                                            />
                                                         )}
                                                      </form.AppField>
                                                      <form.Subscribe
                                                         selector={state =>
                                                            state.values.arenas[
                                                               index
                                                            ].info[subIndex]
                                                               .categories
                                                         }
                                                      >
                                                         {() => (
                                                            <form.AppField
                                                               name={`arenas[${index}].info[${subIndex}].categories`}
                                                               mode="array"
                                                            >
                                                               {categoriesField => (
                                                                  <categoriesField.SelectField
                                                                     source={
                                                                        API.CATEGORIES
                                                                     }
                                                                     queryKey={
                                                                        QUERY_KEYS.CATEGORIES
                                                                     }
                                                                     label="Название категорий"
                                                                  />
                                                               )}
                                                            </form.AppField>
                                                         )}
                                                      </form.Subscribe>
                                                   </div>
                                                )
                                             )}
                                          </div>
                                          <AddFieldButton
                                             text="Добавить дисциплину"
                                             clickHandler={() =>
                                                subFieldArr.pushValue({
                                                   discipline: "",
                                                   categories: [],
                                                })
                                             }
                                          />
                                       </div>
                                    )}
                                 </form.Field>
                              </div>
                           ))}
                           <AddFieldButton
                              text="Добавить арену"
                              clickHandler={() =>
                                 fieldArr.pushValue({
                                    arenaTitle: "",
                                    info: [
                                       {
                                          discipline: "",
                                          categories: [],
                                       },
                                    ],
                                 })
                              }
                           />
                        </div>
                     )}
                  </form.Field>
               </FieldGroup>
            </form>
            <div>
               <form.AppForm>
                  <form.SubmitButton />
               </form.AppForm>
            </div>
         </div>
      </MainBlock>
   );
};

export default NewCompetitionPage;
