import { useEffect, useRef, useState } from 'react';
import type { DialogWidget } from '@/ui/Dialog/Dialog';
import {
  CustomCropper,
  type CustomCropperRef
} from '@/ui/Cropper/CustomCropper';
import Dialog from '@/ui/Dialog/Dialog';
import type { useDialogReturn } from '@/ui/Dialog/useDialog';
import { Button } from '@nextui-org/react';

const readFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject('Error reading file');
      }
    };
    reader.readAsDataURL(file);
  });
};

interface EditAvatarPops {
  dialog: DialogWidget;
  data: File;
}

const EditAvatar: React.FC<EditAvatarPops> = ({ dialog, data }) => {
  const cropperRef = useRef<CustomCropperRef>(null);
  const [image, setImage] = useState<string>();

  useEffect(() => {
    if (data) {
      readFile(data).then(res => {
        setImage(res);
      });
    }
  }, [data]);

  if (!image) return <div>Loading...</div>;

  dialog.onOk = async action => {
    if (action == 'save') {
      const canvas = cropperRef.current!.getCanvas();
      if (canvas == null) return;
      canvas.toBlob((blob: any) => {
        let file = new File([blob], data.name, { type: 'image/png' });
        dialog.close(file);
      }, 'image/png');
    }
  };

  return (
    <CustomCropper
      src={image}
      ref={cropperRef}
      // stencilProps={{
      //   // handlers: false,
      //   // lines: true,
      //   movable: false,
      //   resizable: false
      // }}
      stencilSize={{
        width: 300,
        height: 300
      }}
    />
  );
};

interface AvatarDialogProps {
  dialog: useDialogReturn;
}

const AvatarDialog: React.FC<AvatarDialogProps> = ({ dialog }) => {
  return (
    <Dialog
      isOpen={dialog.isOpen}
      close={dialog.close}
      size="xl"
      hideCloseButton
      actions={(d, _, okDisabled) => (
        <div className="flex flex-row gap-3 items-baseline justify-end">
          <Button onPress={() => d.close('cancel')} color="default">
            Cerrar
          </Button>

          <Button
            onPress={d._onOk('save')}
            color="primary"
            disabled={okDisabled}
          >
            Subir foto
          </Button>
        </div>
      )}
    >
      {d => {
        return <EditAvatar dialog={d} data={dialog.data} />;
      }}
    </Dialog>
  );
};

export default AvatarDialog;
