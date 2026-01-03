import React from "react";
import MainBlock from "../../MainBlock";
import AddingButton from "@/components/UI/buttons/AddingButton";
import Table from "@/components/UI/table/Table";
import { API } from "@/constants/api";
import { QUERY_KEYS } from "@/constants/queryKeys";

const CompetitionsPage = () => {
   return (
      <MainBlock
         title="Управление записями соревнований"
         subTitle="Создание, удаление и редактирование соревнований"
         actions={<AddingButton link="/" />}
      >
         <Table source={API.COMPETITIONS} queryKey={QUERY_KEYS.COMPETITIONS} />
      </MainBlock>
   );
};

export default CompetitionsPage;
