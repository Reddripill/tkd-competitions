import React from "react";
import { Metadata } from "next";
import CompetitionsPage from "@/components/admin/screens/competitions/CompetitionsPage";

export const metadata: Metadata = {
   title: "Соревнования",
};

const Page = () => {
   return <CompetitionsPage />;
};

export default Page;
