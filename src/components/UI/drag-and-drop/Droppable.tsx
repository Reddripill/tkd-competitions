import React, { useId, useRef } from "react";
import { useDroppable } from "@dnd-kit/core";

interface IProps {
   children: React.ReactNode;
}

const Droppable = ({ children }: IProps) => {
   const id = useId();
   const droppableRef = useRef(null);
   const { isOver, setNodeRef } = useDroppable({
      id: `droppable-${id}`,
   });
   return <div ref={droppableRef}>{children}</div>;
};

export default Droppable;
