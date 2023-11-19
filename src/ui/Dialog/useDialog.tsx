import { useDisclosure } from '@nextui-org/react';
import { useState, useRef, useCallback } from 'react';

interface DialogPromise {
  dialogId?: string;
  feedback?: any;
  args: any;
}

export interface useDialogReturn {
  openDialog(d?: any): Promise<DialogPromise>;
  closeDialog(dialogId?: string, feedback?: any): void;
  data: any;
  isOpen: boolean;
//   onOpenChange(): void;
}

const useDialog = (dialogId?: string): useDialogReturn => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState();
  const resolveRef = useRef<any>();
  const rejectRef = useRef<any>();

  const openDialog = useCallback((d?: any) => {
    setData(d);
    onOpen();
    return new Promise<DialogPromise>((resolve, reject) => {
      resolveRef.current = resolve;
      rejectRef.current = reject;
    });
  }, []);

  const closeDialog = useCallback(function (
    dialogId: string,
    feedback: any = 'cancel'
  ) {
    onClose();
    setData(undefined);
    let args = Array.prototype.slice.call(arguments);
    args.splice(0, 2);

    if (typeof feedback == 'object' && feedback.key === 'Escape') {
      feedback = 'cancel';
    }
    if (feedback && feedback !== 'cancel') {
      resolveRef.current({ dialogId, feedback, args });
    } else {
      rejectRef.current({ dialogId, feedback });
    }
  },
  []);

  return {
    openDialog,
    closeDialog,
    // onOpenChange,
    data,
    isOpen
  };
};

export default useDialog;
