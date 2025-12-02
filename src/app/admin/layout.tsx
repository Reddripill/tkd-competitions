import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";

const layout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="w-full h-full flex flex-col basis-full grow shrink-0">
         <AdminLayout>{children}</AdminLayout>
      </div>
   );
};

export default layout;
