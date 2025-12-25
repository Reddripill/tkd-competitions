import { RefObject, useEffect } from "react";

const useOutside = (ref: RefObject<Element | null>, action: () => void) => {
   useEffect(() => {
      const handler = (e: MouseEvent | Event) => {
         if (ref.current && !ref.current.contains(e.target as Node)) {
            action();
         }
      };
      document.body.addEventListener("mousedown", handler);
      return () => {
         document.body.removeEventListener("mousedown", handler);
      };
   }, [ref, action]);
};

export default useOutside;
