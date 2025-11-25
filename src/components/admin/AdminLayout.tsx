import React from "react";
import Sidebar from "./Sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="h-full w-full flex">
         <Sidebar />
         <div className="grow">{children}</div>
      </div>
   );
};

export default AdminLayout;
