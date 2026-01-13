"use client";
import React, { useState } from "react";
import MainBlock from "../../MainBlock";
import AddingButton from "@/components/UI/buttons/AddingButton";
import Table from "@/components/UI/table/Table";
import { API } from "@/constants/api";
import { QUERY_KEYS } from "@/constants/queryKeys";
import CreateModal from "@/components/UI/modals/CreateModal";

const DisciplinesPage = () => {
   const [isOpen, setIsOpen] = useState(false);
   return (
      <MainBlock
         title="Управление записями дисциплин"
         subTitle="Создание, удаление и редактирование дисциплин"
         actions={<AddingButton action={() => setIsOpen(true)} />}
      >
         <CreateModal
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            source={API.DISCIPLINES}
            queryKey={QUERY_KEYS.DISCIPLINES}
         />
         <Table source={API.DISCIPLINES} queryKey={QUERY_KEYS.DISCIPLINES} />
      </MainBlock>
   );
};

export default DisciplinesPage;
