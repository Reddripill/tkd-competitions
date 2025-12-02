import React from "react";
import MainBlock from "../../MainBlock";
import AddingButton from "@/components/UI/buttons/AddingButton";

const CompetitionsPage = () => {
   return (
      <MainBlock
         title="Управление записями соревнований"
         subTitle="Создание, удаление и редактирование соревнований"
         actions={<AddingButton link="/" />}
      >
         <div>HomePage</div>
      </MainBlock>
   );
};

export default CompetitionsPage;
