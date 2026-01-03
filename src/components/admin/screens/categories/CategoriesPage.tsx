import React from "react";
import MainBlock from "../../MainBlock";
import AddingButton from "@/components/UI/buttons/AddingButton";
import Table from "@/components/UI/table/Table";
import { API } from "@/constants/api";
import { QUERY_KEYS } from "@/constants/queryKeys";

const CategoriesPage = () => {
   return (
      <MainBlock
         title="Управление записями категорий"
         subTitle="Создание, удаление и редактирование категорий"
         actions={<AddingButton link="/" />}
      >
         <Table source={API.CATEGORIES} queryKey={QUERY_KEYS.CATEGORIES} />
      </MainBlock>
   );
};

export default CategoriesPage;
