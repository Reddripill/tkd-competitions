import { Plus } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";

const AddingButton = ({ link }: { link: string }) => {
   return (
      <Button
         asChild={true}
         size="lg"
         className="bg-blue-accent hover:bg-blue-accent/80 transition-colors"
      >
         <Link href={link} className="flex items-center gap-x-2 text-white">
            <Plus />
            <div>Добавить</div>
         </Link>
      </Button>
   );
};

export default AddingButton;
