import React from "react";
import MainBlock from "../../MainBlock";
import AddingButton from "@/components/UI/buttons/AddingButton";

const CategoriesPage = () => {
   return (
      <MainBlock
         title="Управление записями категорий"
         subTitle="Создание, удаление и редактирование категорий"
         actions={<AddingButton link="/" />}
      >
         <div>HomePage</div>
      </MainBlock>
   );
};

export default CategoriesPage;
