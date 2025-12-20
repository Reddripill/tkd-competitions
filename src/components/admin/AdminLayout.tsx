import React from "react";
import Sidebar from "./Sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
   return (
      <div className="h-full w-full flex bg-light-white">
         <Sidebar />
         <div className="h-full w-full overflow-auto">{children}</div>
      </div>
   );
};

export default AdminLayout;
