import { SetStateType } from "./main.types";

export interface IModalProps {
   isOpen: boolean;
   setIsOpen: SetStateType<boolean>;
}

interface IModalContent {
   title: string;
   description: string;
   actionBtnText: string;
   cancelBtnText?: string;
}

export interface IModalCustomContent extends IModalProps, IModalContent {}

export interface IModalOptionalContent
   extends IModalProps,
      Partial<IModalContent> {}
