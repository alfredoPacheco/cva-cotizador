import { useDisclosure } from '@nextui-org/react';
import { useState, useRef, useCallback } from 'react';

interface DialogPromise {
  dialogId?: string;
  feedback?: any;
  args: any;
}

interface DialogProps {
  onOk?(action: string): Promise<any>;
}
export interface useDialogReturn {
  open(d?: any): Promise<DialogPromise>;
  close(dialogId?: string, feedback?: any): void;
  data: any;
  isOpen: boolean;
  onOk?(action: string): Promise<any>;
}

const useDialog = (dialogProps?: DialogProps): useDialogReturn => {
  const { onOk } = dialogProps || {};
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [data, setData] = useState();
  const resolveRef = useRef<any>();
  const rejectRef = useRef<any>();

  const open = useCallback((d?: any) => {
    setData(d);
    onOpen();
    return new Promise<DialogPromise>((resolve, reject) => {
      resolveRef.current = resolve;
      rejectRef.current = reject;
    });
  }, []);

  const close = useCallback(function (
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
    open,
    close,
    data,
    isOpen,
    onOk
  };
};

export default useDialog;
