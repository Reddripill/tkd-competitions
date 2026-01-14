"use client";
import React, { useState } from "react";
import MainBlock from "../../MainBlock";
import AddingButton from "@/components/UI/buttons/AddingButton";
import Table from "@/components/UI/table/Table";
import { API } from "@/constants/api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import CreateModal from "@/components/UI/modals/CreateModal";

const CategoriesPage = () => {
   const [isOpen, setIsOpen] = useState(false);
   return (
      <MainBlock
         title="Управление записями категорий"
         subTitle="Создание, удаление и редактирование категорий"
         actions={<AddingButton action={() => setIsOpen(true)} />}
      >
         <CreateModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            source={API.CATEGORIES}
            queryKey={QUERY_KEYS.CATEGORIES}
         />
         <Table source={API.CATEGORIES} queryKey={QUERY_KEYS.CATEGORIES} />
      </MainBlock>
   );
};

export default CategoriesPage;
