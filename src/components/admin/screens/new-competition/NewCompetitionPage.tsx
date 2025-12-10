"use client";
import React from "react";
import MainBlock from "../../MainBlock";
import { Field, FieldGroup, FieldLabel } from "@/components/UI/field";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/UI/input";
import InputAndSelect from "@/components/UI/InputAndSelect";

interface ICompetition {
   title: string;
   categories: string[];
}

const defaultCompetition: ICompetition = {
   categories: [],
   title: "",
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
      <MainBlock title="Создание нового соревнования" className="mb-20">
         <form
            onSubmit={e => {
               e.preventDefault();
            }}
         >
            <FieldGroup className="flex flex-col gap-y-6 max-w-[50%] mx-auto">
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
                           onChange={e => field.handleChange(e.target.value)}
                           className="h-10"
                           // aria-invalid={isInvalid}
                           // placeholder="Login button not working on mobile"
                           autoComplete="off"
                        />
                     </Field>
                  )}
               </form.Field>
               <form.Field name="categories" mode="array">
                  {fieldArr => (
                     <div>
                        <FieldLabel className="mb-3">
                           Название категорий
                        </FieldLabel>
                        <InputAndSelect
                           clickHandler={val => {
                              fieldArr.pushValue(val);
                           }}
                           unselectHandler={val => {
                              console.log(val);
                              const index = fieldArr.state.value.findIndex(
                                 item => item === val
                              );
                              console.log(index);
                              if (index !== -1) {
                                 fieldArr.removeValue(index);
                              }
                           }}
                        />
                     </div>
                  )}
               </form.Field>
            </FieldGroup>
         </form>
      </MainBlock>
   );
};

export default NewCompetitionPage;
