"use client";
import React from "react";
import MainBlock from "../../MainBlock";
import {
   Field,
   FieldGroup,
   FieldLabel,
} from "@/components/UI/lib-components/field";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/UI/lib-components/input";
import InputAndSelect from "@/components/UI/InputAndSelect";
import ActionButton from "@/components/UI/buttons/ActionButton";
import { Plus } from "lucide-react";

interface IArenaField {
   title: string;
   info: IArenaInfo[];
}

interface IArenaInfo {
   discipline: string;
   categories: string[];
}

interface ICompetition {
   title: string;
   arenas: IArenaField[];
}

const defaultCompetition: ICompetition = {
   title: "",
   arenas: [
      {
         title: "",
         info: [
            {
               discipline: "",
               categories: [],
            },
         ],
      },
   ],
};

const NewCompetitionPage = () => {
   const form = useForm({
      defaultValues: defaultCompetition,
      onSubmit: async ({ value }) => {
         // Do something with form data
         console.log(value);
      },
   });
   return (
      <MainBlock title="Создание нового соревнования">
         <div className="flex justify-between gap-x-24 w-full">
            <form
               onSubmit={e => {
                  e.preventDefault();
               }}
               className="w-full"
            >
               <FieldGroup className="flex flex-col gap-y-6">
                  <div className="border p-8 rounded-lg border-border-gray shadow-border">
                     <form.Field name="title">
                        {field => (
                           <Field>
                              <FieldLabel htmlFor={field.name}>
                                 Название соревнования *
                              </FieldLabel>
                              <Input
                                 id={field.name}
                                 name={field.name}
                                 value={field.state.value}
                                 onBlur={field.handleBlur}
                                 onChange={e =>
                                    field.handleChange(e.target.value)
                                 }
                                 className="h-10"
                                 autoComplete="off"
                              />
                           </Field>
                        )}
                     </form.Field>
                  </div>

                  <form.Field name="arenas" mode="array">
                     {fieldArr => (
                        <div>
                           {fieldArr.state.value.map((_, index) => (
                              <div
                                 key={index}
                                 className="flex flex-col gap-y-8 mb-6 py-8 rounded-lg border-border-gray shadow-border"
                              >
                                 <form.Field name={`arenas[${index}].title`}>
                                    {field => (
                                       <div className="px-8 pb-8 border-b border-border">
                                          <FieldLabel className="mb-3">
                                             Название арены *
                                          </FieldLabel>
                                          <InputAndSelect
                                             isMulti={false}
                                             clickHandler={val => {
                                                field.handleChange(val);
                                             }}
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
                                          <div>
                                             <div className="px-8 pt-4 pb-4 first:pt-0 last:pb-0 last:border-none border-b border-border">
                                                {subFieldArr.state.value.map(
                                                   (_, subIndex) => (
                                                      <div
                                                         className="flex flex-col gap-y-6 mb-6"
                                                         key={subIndex}
                                                      >
                                                         <form.Field
                                                            name={`arenas[${index}].info[${subIndex}].discipline`}
                                                         >
                                                            {disciplineField => (
                                                               <div>
                                                                  <FieldLabel className="mb-3">
                                                                     Название
                                                                     дисциплины
                                                                  </FieldLabel>
                                                                  <InputAndSelect
                                                                     isMulti={
                                                                        false
                                                                     }
                                                                     clickHandler={val => {
                                                                        disciplineField.handleChange(
                                                                           val
                                                                        );
                                                                     }}
                                                                  />
                                                               </div>
                                                            )}
                                                         </form.Field>
                                                         <form.Field
                                                            name={`arenas[${index}].info[${subIndex}].categories`}
                                                            mode="array"
                                                         >
                                                            {categoriesField => (
                                                               <div>
                                                                  <FieldLabel className="mb-3">
                                                                     Название
                                                                     категорий
                                                                  </FieldLabel>
                                                                  <InputAndSelect
                                                                     clickHandler={val => {
                                                                        console.log(
                                                                           val
                                                                        );
                                                                     }}
                                                                  />
                                                               </div>
                                                            )}
                                                         </form.Field>
                                                      </div>
                                                   )
                                                )}
                                             </div>
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
                                    title: "",
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
               <ActionButton
                  className="rounded-lg text-lg h-12 w-[200px]"
                  action={() => console.log("Сохранение")}
               >
                  Сохранить
               </ActionButton>
            </div>
         </div>
      </MainBlock>
   );
};

export default NewCompetitionPage;
