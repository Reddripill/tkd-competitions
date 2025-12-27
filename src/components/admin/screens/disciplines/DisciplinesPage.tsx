import React from "react";
import MainBlock from "../../MainBlock";
import AddingButton from "@/components/UI/buttons/AddingButton";
import DisciplinesTable from "./DisciplinesTable";

const DisciplinesPage = () => {
   return (
      <MainBlock
         title="Управление записями дисциплин"
         subTitle="Создание, удаление и редактирование дисциплин"
         actions={<AddingButton link="/" />}
      >
         <DisciplinesTable />
      </MainBlock>
   );
};

export default DisciplinesPage;
