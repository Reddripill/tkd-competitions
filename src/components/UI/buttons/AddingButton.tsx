import { Plus } from "lucide-react";
import { Button } from "./button";
import Link from "next/link";

interface IProps {
   link?: string;
   action?: () => void;
}

const AddingButton = ({ link, action }: IProps) => {
   const content = (
      <>
         <Plus />
         <div>Добавить</div>
      </>
   );
   const styles = "flex items-center gap-x-2 text-white";
   return (
      <Button
         asChild={!!link}
         size="lg"
         className="bg-blue-accent hover:bg-blue-accent/80 transition-colors px-4"
         onClick={action}
      >
         {link ? (
            <Link href={link} className={styles}>
               {content}
            </Link>
         ) : (
            <div className={styles}>{content}</div>
         )}
      </Button>
   );
};

export default AddingButton;
