"use client";
import React from "react";
import MainBlock from "../../MainBlock";
import AddingButton from "@/components/UI/buttons/AddingButton";
import { ROUTES } from "@/constants/routes";
import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { API } from "@/constants/api";
import { ITournament } from "@/types/entities.types";
import { Spinner } from "@/components/UI/lib-components/spinner";
import NotExist from "@/components/UI/NotExist";
import AdminTournamentGrid from "@/components/UI/tournament-card/AdminTournamentGrid";
import { IBaseEntityWithTitleAndCount } from "@/types/main.types";

const HomePage = () => {
   const {
      data: response,
      isPending,
      isError,
   } = useQuery<IBaseEntityWithTitleAndCount<ITournament>>({
      queryKey: [QUERY_KEYS.TOURNAMENTS],
      queryFn: async () => {
         const data = await fetch(API.TOURNAMENTS);
         const result = await data.json();
         return result;
      },
   });
   if (isPending) {
      return <Spinner />;
   }
   if (isError) {
      return <div>Ошибка получения данных</div>;
   }
   return (
      <MainBlock
         title="Список соревнований"
         subTitle="Наглядное представление всех соревнований и мест их проведения"
         actions={<AddingButton link={ROUTES.NEW_COMPETITION} />}
      >
         {response && response.count !== 0 ? (
            <div>
               <AdminTournamentGrid tournaments={response.data} />
            </div>
         ) : (
            <NotExist />
         )}
      </MainBlock>
   );
};

export default HomePage;
