import AvatarDialog from '@/ui/Avatar/EditAvatar';
import { storage } from '@/core/appwriteClient';
import { Button, Image } from '@nextui-org/react';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import useDialog from '@/ui/Dialog/useDialog';
import { ID } from 'appwrite';
import { useCallback, useRef, useState } from 'react';
import Dropzone from 'react-dropzone';

const BUCKET_ID = import.meta.env.PUBLIC_APPWRITE_STORAGE_AVATARS;

interface AvatarProps {
  fileId?: string;
  directUpload?: boolean;
  readOnly?: boolean;
  onChange(fileId: string, file: IAttachment): void;
  width?: number;
  height?: number;
}

interface IAttachment extends File {
  isForUpload?: boolean;
}

function getAvatarUrl(fileId?: string) {
  if (!fileId) return null;
  const f = storage.getFilePreview(BUCKET_ID, fileId);
  // console.log('f', f);
  return f;
}

const Avatar: React.FC<AvatarProps> = ({
  fileId,
  directUpload,
  readOnly,
  onChange,
  width = 150,
  height = 150
}) => {
  const el = useRef<any>();
  const avatarDialog = useDialog();

  const { data, isLoading } = useQuery({
    queryKey: ['avatar', fileId],
    queryFn: () => getAvatarUrl(fileId),
    enabled: !!fileId && !avatarDialog.isOpen,
    retry: false,
    placeholderData: keepPreviousData
  });

  const [uploading, setUploading] = useState<boolean>(false);

  const uploadSingleFile = async (file: IAttachment): Promise<IAttachment> => {
    try {
      const response = await storage.createFile(BUCKET_ID, ID.unique(), file);
      const updatedFile = {
        ...file,
        isForUpload: false
      };
      onChange(response.$id, file);
      return updatedFile as any;
    } catch (err) {
      console.error(err);
      const updatedFile = { ...file, status: 'error' };
      return updatedFile;
    }
  };

  const uploadFiles = async (files: IAttachment[]) => {
    const filesToUpload = files.filter((file: IAttachment) => file.isForUpload);
    if (filesToUpload.length > 0) {
      setUploading(true);
      try {
        for (const [index] of filesToUpload.entries()) {
          const file = await uploadSingleFile(filesToUpload[index]);
          const updatedFiles = files.map(f => {
            if (f.name === file.name) {
              return { ...f, isForUpload: false };
            }
            return f;
          });
          //   _onChange(updatedFiles);
        }

        // if (afterUpload) await afterUpload();
      } catch (e) {
        console.error(e);
        alert(JSON.stringify(e, null, 3));
      } finally {
        setUploading(false);
      }
    }
    // return owner;
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const filesToUpload = acceptedFiles.map((file: IAttachment) => {
        file.isForUpload = true;
        return file;
      });

      if (directUpload && !uploading) uploadFiles(filesToUpload);

      avatarDialog.open(filesToUpload[0]).then(res => {
        console.log('feedback', res);
        const croppedFile = res.feedback;
        croppedFile.isForUpload = true;
        uploadFiles([croppedFile]);
      });
    },
    [fileId]
  );

  const [borderColor, setBorderColor] = useState<string>('#e0e0e0');

  const openFileDialog = () => {
    !readOnly && el.current.open && el.current.open();
  };
  // const [counter, setCounter] = useState(0);

  return (
    <>
      <AvatarDialog dialog={avatarDialog} />
      <Dropzone
        ref={el}
        multiple={false}
        onDrop={onDrop}
        noClick
        onDragEnter={() => setBorderColor('blue')}
        onDragLeave={() => setBorderColor('#e0e0e0')}
        onDropAccepted={() => setBorderColor('#e0e0e0')}
        onDropRejected={() => setBorderColor('#e0e0e0')}
        disabled={readOnly}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            className="flex flex-col"
            {...getRootProps()}
            style={{ borderColor, padding: 0 }}
            tabIndex={-1}
            onDoubleClick={openFileDialog}
          >
            <input {...getInputProps()} style={{ display: 'none' }} />
            {/* {firstOne && firstOne.ImageBase64 ? (
              <Button
                disabled={readOnly}
                onClick={() => !readOnly && directRemoveFile(firstOne)}
              >
                <Avatar
                  style={avatarStyle}
                  src={`data:image/png;base64,${firstOne.ImageBase64}`}
                  alt="Avatar"
                />
              </Button>
            ) : ( */}
            <Button
              className={`p-0 rounded-full ${
                data?.href ? '' : 'border-1 border-default-300'
              }`}
              variant="light"
              style={{ width, height, minHeight: 0, minWidth: 0 }}
              onPress={openFileDialog}
              disableRipple={readOnly}
              // onPress={() => !readOnly && directRemoveFile(firstOne)}
            >
              <Image src={data?.href} width="150" height="150" />
            </Button>
          </div>
        )}
      </Dropzone>
    </>
  );
};

export default Avatar;
