import { useState } from 'react';
import Dialog from './Dialog';
import useDialog from './useDialog';

interface ConfirmProps {
  id?: string;
  message?: string;
  okLabel?: string;
  children?: React.ReactNode;
}

const useConfirmDialog = (props?: ConfirmProps) => {
  const { message, id = 'confirm', okLabel: okLabel } = props || {};
  const dialog = useDialog();
  const { open, data, close, isOpen } = dialog;
  const [callback, setCallback] = useState<any>();

  return {
    Confirm: (compProps: ConfirmProps) => (
      <Dialog
        id={compProps.id || id}
        isOpen={isOpen}
        close={close}
        okLabel={compProps.okLabel || okLabel || 'OK'}
        fullScreen={false}
      >
        {dialog => {
          dialog.onOk = async () => {
            if (callback) await callback();
            return close(id, 'ok');
          };
          return (
            compProps.children ||
            props?.children || <p className="my-8">{data || message}</p>
          );
        }}
      </Dialog>
    ),
    openConfirm: (d, waitForCallback?) => {
      setCallback(() => waitForCallback);
      return open(d);
    },
    IsConfirmOpen: isOpen,
    ...dialog
  };
};

export default useConfirmDialog;
