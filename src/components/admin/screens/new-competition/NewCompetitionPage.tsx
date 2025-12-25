"use client";
import React from "react";
import MainBlock from "../../MainBlock";
import { FieldGroup } from "@/components/UI/lib-components/field";
import { useForm } from "@tanstack/react-form";
import InputAndSelect from "@/components/UI/InputAndSelect";
import ActionButton from "@/components/UI/buttons/ActionButton";
import { Plus } from "lucide-react";
import { API } from "@/constants/api";
import { newCompetitionSchema } from "./new-competition.schema";
import { defaultCompetition } from "./new-competition.constants";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { Spinner } from "@/components/UI/lib-components/spinner";
import { Toaster, toast } from "sonner";

const NewCompetitionPage = () => {
   const form = useForm({
      defaultValues: defaultCompetition,
      onSubmit: async ({ value }) => {
         await fetch(API.COMPETITIONS, {
            method: "POST",
            headers: {
               "Content-Type": "application/json",
            },
            body: JSON.stringify({
               tournamentTitle: value.tournamentTitle,
               arenas: value.arenas,
            }),
         });
      },
      validators: {
         onChange: newCompetitionSchema,
         onBlur: newCompetitionSchema,
      },
   });
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
      <MainBlock title="Создание нового соревнования">
         <Toaster position="top-center" expand={true} richColors={true} />
         <div className="flex justify-between gap-x-24 w-full">
            <form
               onSubmit={e => {
                  e.preventDefault();
                  e.stopPropagation();
               }}
               className="w-full"
            >
               <FieldGroup className="flex flex-col gap-y-10">
                  <form.Field name="tournamentTitle">
                     {field => {
                        return (
                           <div className="border p-8 rounded-lg border-border-gray shadow-border">
                              <InputAndSelect
                                 isMulti={false}
                                 label="Название соревнования *"
                                 isValid={
                                    field.state.meta.isValid ||
                                    !field.state.meta.isTouched
                                 }
                                 message={field.state.meta.errors[0]?.message}
                                 source={API.TOURNAMENTS}
                                 queryKey={QUERY_KEYS.TOURNAMENTS}
                                 changeHandler={val => {
                                    field.handleChange(val);
                                 }}
                                 blurHandler={field.handleBlur}
                              />
                           </div>
                        );
                     }}
                  </form.Field>
                  <form.Field name="arenas" mode="array">
                     {fieldArr => (
                        <div className="flex flex-col gap-y-10">
                           {fieldArr.state.value.map((_, index) => (
                              <div
                                 key={index}
                                 className="flex flex-col gap-y-8 py-8 rounded-lg border-border-gray shadow-border"
                              >
                                 <form.Field
                                    name={`arenas[${index}].arenaTitle`}
                                 >
                                    {arenaField => (
                                       <div className="px-8 pb-8 border-b border-border">
                                          <InputAndSelect
                                             isMulti={false}
                                             label="Название арены *"
                                             isValid={
                                                arenaField.state.meta.isValid ||
                                                !arenaField.state.meta.isTouched
                                             }
                                             message={
                                                arenaField.state.meta.errors[0]
                                                   ?.message
                                             }
                                             source={API.CATEGORIES}
                                             changeHandler={val => {
                                                arenaField.handleChange(val);
                                             }}
                                             blurHandler={arenaField.handleBlur}
                                          />
                                       </div>
                                    )}
                                 </form.Field>
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
                                                      <form.Field
                                                         name={`arenas[${index}].info[${subIndex}].discipline`}
                                                      >
                                                         {disciplineField => (
                                                            <InputAndSelect
                                                               source={
                                                                  API.DISCIPLINES
                                                               }
                                                               queryKey={
                                                                  QUERY_KEYS.DISCIPLINES
                                                               }
                                                               label="Название дисциплины"
                                                               isMulti={false}
                                                               isValid={
                                                                  disciplineField
                                                                     .state.meta
                                                                     .isValid
                                                               }
                                                               message={
                                                                  disciplineField
                                                                     .state.meta
                                                                     .errors[0]
                                                                     ?.message
                                                               }
                                                               changeHandler={val => {
                                                                  disciplineField.handleChange(
                                                                     val
                                                                  );
                                                               }}
                                                               blurHandler={
                                                                  disciplineField.handleBlur
                                                               }
                                                            />
                                                         )}
                                                      </form.Field>
                                                      <form.Subscribe
                                                         selector={state =>
                                                            state.values.arenas[
                                                               index
                                                            ].info[subIndex]
                                                               .categories
                                                         }
                                                      >
                                                         {() => (
                                                            <form.Field
                                                               name={`arenas[${index}].info[${subIndex}].categories`}
                                                               mode="array"
                                                            >
                                                               {categoriesField => (
                                                                  <InputAndSelect
                                                                     source={
                                                                        API.CATEGORIES
                                                                     }
                                                                     queryKey={
                                                                        QUERY_KEYS.CATEGORIES
                                                                     }
                                                                     label="Название категорий"
                                                                     isValid={
                                                                        categoriesField
                                                                           .state
                                                                           .meta
                                                                           .isValid
                                                                     }
                                                                     message={
                                                                        categoriesField
                                                                           .state
                                                                           .meta
                                                                           .errors[0]
                                                                           ?.message
                                                                     }
                                                                     changeHandler={val => {
                                                                        categoriesField.pushValue(
                                                                           val
                                                                        );
                                                                     }}
                                                                     blurHandler={
                                                                        categoriesField.handleBlur
                                                                     }
                                                                     unselectHandler={val => {
                                                                        const index =
                                                                           categoriesField.state.value.findIndex(
                                                                              item =>
                                                                                 item ===
                                                                                 val
                                                                           );
                                                                        if (
                                                                           index !==
                                                                           -1
                                                                        ) {
                                                                           categoriesField.removeValue(
                                                                              index
                                                                           );
                                                                        }
                                                                     }}
                                                                  />
                                                               )}
                                                            </form.Field>
                                                         )}
                                                      </form.Subscribe>
                                                   </div>
                                                )
                                             )}
                                          </div>
                                          <button
                                             type="button"
                                             className="flex items-center gap-x-2 mx-auto text-sm text-blue-accent"
                                             onClick={() =>
                                                subFieldArr.pushValue({
                                                   discipline: "",
                                                   categories: [],
                                                })
                                             }
                                          >
                                             <Plus size={18} />
                                             <div>Добавить дисциплину</div>
                                          </button>
                                       </div>
                                    )}
                                 </form.Field>
                              </div>
                           ))}
                           <button
                              type="button"
                              className="flex items-center gap-x-2 mx-auto text-sm text-blue-accent"
                              onClick={() =>
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
                           >
                              <Plus size={18} />
                              <div>Добавить арену</div>
                           </button>
                        </div>
                     )}
                  </form.Field>
               </FieldGroup>
            </form>
            <div>
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
            </div>
         </div>
      </MainBlock>
   );
};

export default NewCompetitionPage;
