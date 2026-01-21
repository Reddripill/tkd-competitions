"use client";
import React from "react";
import MainBlock from "../../MainBlock";
import AddingButton from "@/components/UI/buttons/AddingButton";
import { ROUTES } from "@/constants/routes";
import { useQuery } from "@tanstack/react-query";
import { IBaseEntityWithTitleAndCount } from "@/types/main.types";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { API } from "@/constants/api";

const HomePage = () => {
   const { data } = useQuery<IBaseEntityWithTitleAndCount>({
      queryKey: [QUERY_KEYS.TOURNAMENTS],
      queryFn: async () => {
         const data = await fetch(API.TOURNAMENTS);
         const result = await data.json();
         return result;
      },
   });
   console.log(data);
   return (
      <MainBlock
         title="Список соревнований"
         subTitle="Наглядное представление всех соревнований и мест их проведения"
         actions={<AddingButton link={ROUTES.NEW_COMPETITION} />}
      >
         <div>HomePage</div>
      </MainBlock>
   );
};

export default HomePage;
