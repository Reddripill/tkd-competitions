import React from "react";
import Sidebar from "./Sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="h-full w-full flex overflow-hidden bg-light-white">
         <Sidebar />
         {children}
      </div>
   );
};

export default AdminLayout;
