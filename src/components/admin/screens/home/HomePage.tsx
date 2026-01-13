import React from "react";
import MainBlock from "../../MainBlock";
import AddingButton from "@/components/UI/buttons/AddingButton";
import { ROUTES } from "@/constants/routes";

const HomePage = () => {
   return (
      <MainBlock
         title="Список соревнований"
         subTitle="Наглядное представление всех соревнований и местами их проведения"
         actions={<AddingButton link={ROUTES.NEW_COMPETITION} />}
      >
         <div>HomePage</div>
      </MainBlock>
   );
};

export default HomePage;
