import React, { useId } from "react";
import { useDraggable } from "@dnd-kit/core";

interface IProps {
   children: React.ReactNode;
}

const Draggable = ({ children }: IProps) => {
   const id = useId();
   const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: `draggable-${id}`,
   });
   const style = transform
      ? {
           transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        }
      : undefined;

   return (
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
         {children}
      </div>
   );
};

export default Draggable;
