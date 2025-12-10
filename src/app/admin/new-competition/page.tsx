import React from "react";
import { Metadata } from "next";
import NewCompetitionPage from "@/components/admin/screens/new-competition/NewCompetitionPage";

export const metadata: Metadata = {
   title: "Новое соревнование",
};

const Page = () => {
   return <NewCompetitionPage />;
};

export default Page;
