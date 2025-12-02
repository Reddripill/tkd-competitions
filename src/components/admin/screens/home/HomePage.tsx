import React from "react";
import MainBlock from "../../MainBlock";
import AddingButton from "@/components/UI/buttons/AddingButton";

const HomePage = () => {
   return (
      <MainBlock
         title="Список соревнований"
         subTitle="Наглядное представление всех соревнований и местами их проведения"
         actions={<AddingButton link="/" />}
      >
         <div>HomePage</div>
      </MainBlock>
   );
};

export default HomePage;
