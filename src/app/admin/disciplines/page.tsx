import React from "react";
import { Metadata } from "next";
import DisciplinesPage from "@/components/admin/screens/disciplines/DisciplinesPage";

export const metadata: Metadata = {
   title: "Дисциплины",
};

const Page = () => {
   return <DisciplinesPage />;
};

export default Page;
