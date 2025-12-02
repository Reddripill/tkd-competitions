import React from "react";
import MainBlock from "../../MainBlock";
import AddingButton from "@/components/UI/buttons/AddingButton";

const DisciplinesPage = () => {
   return (
      <MainBlock
         title="Управление записями дисциплин"
         subTitle="Создание, удаление и редактирование дисциплин"
         actions={<AddingButton link="/" />}
      >
         <div>HomePage</div>
      </MainBlock>
   );
};

export default DisciplinesPage;
