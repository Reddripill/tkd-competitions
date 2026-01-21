"use client";

import dynamic from "next/dynamic";

const TanStackDevtools = dynamic(
   async () => {
      if (process.env.NODE_ENV !== "development") {
         return () => null;
      }

      const { TanStackDevtools } = await import("@tanstack/react-devtools");
      const { formDevtoolsPlugin } = await import(
         "@tanstack/react-form-devtools"
      );

      return function Devtools() {
         return <TanStackDevtools plugins={[formDevtoolsPlugin()]} />;
      };
   },
   {
      ssr: false,
   }
);

export default TanStackDevtools;
