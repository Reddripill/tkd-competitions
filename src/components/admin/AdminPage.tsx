import React from "react";
import Sidebar from "./Sidebar";

const AdminPage = () => {
   return (
      <div className="h-full w-full flex">
         <Sidebar />
         <div className="grow">MAIN</div>
      </div>
   );
};

export default AdminPage;
