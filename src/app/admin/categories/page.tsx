import React from "react";
import { Metadata } from "next";
import CategoriesPage from "@/components/admin/screens/categories/CategoriesPage";

export const metadata: Metadata = {
   title: "Категории",
};

const Page = () => {
   return <CategoriesPage />;
};

export default Page;
