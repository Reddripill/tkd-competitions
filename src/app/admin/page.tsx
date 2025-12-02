import { Metadata } from "next";
import HomePage from "@/components/admin/screens/home/HomePage";

export const metadata: Metadata = {
   title: "Админ панель",
};

const Page = () => {
   return <HomePage />;
};

export default Page;
