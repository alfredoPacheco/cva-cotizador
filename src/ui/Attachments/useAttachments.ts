import { useRef, useState } from 'react';
import { ID, storage } from '@/core/appwriteClient';
import { fileSerialize } from './FileSerialize';

export interface AttachmentsProps {
  api?: any;
  kind?: string;
  value: IAttachment[];
  onChange?(
    files: IAttachment[],
    serializedFiles: string[],
    directUpload: boolean | undefined,
    kind: string
  ): void;
  readOnly?: boolean;
  noButton?: boolean;
  printMode?: boolean;
  afterDelete?: any;
  directUpload?: boolean;
  directRemove?: boolean;
  afterUpload?(): any;
}

export interface IAttachment extends File {
  $id?: string;
  FileName: string;
  Directory: string;
  AttachmentKind: string;
  isForUpload: boolean;
  name: string;
  ImageBase64: string | null;
  ToDelete?: boolean;
  status?: string;
}

const useAttachments = (props: AttachmentsProps) => {
  const {
    api,
    kind = '',
    onChange,
    value,
    directUpload,
    directRemove,
    afterUpload,
    afterDelete,
    readOnly,
    printMode,
    noButton
  } = props;

  const [uploading, setUploading] = useState<boolean>(false);
  const [borderColor, setBorderColor] = useState<string>('#e0e0e0');

  const el = useRef<any>();

  const uploadSingleFile = async (file: IAttachment): Promise<IAttachment> => {
    try {
      const response = await storage.createFile(kind, ID.unique(), file);
      const updatedFile = {
        ...file,
        isForUpload: false,
        $id: response.$id
      };
      return updatedFile as any;
    } catch (err) {
      console.error(err);
      const updatedFile = { ...file, status: 'error' };
      return updatedFile as any;
    }
  };

  const uploadFiles = async files => {
    const filesToUpload = files.filter((file: IAttachment) => file.isForUpload);
    if (filesToUpload.length > 0) {
      setUploading(true);
      try {
        let onChangeReturn;
        let updatedFiles = [...files];
        for (const [index] of filesToUpload.entries()) {
          const file = await uploadSingleFile(filesToUpload[index]);
          updatedFiles = updatedFiles.map((f: any) => {
            if (f.FileName === file.FileName) {
              return {
                ...f,
                ...file
              };
            }
            return f;
          });
          onChangeReturn = _onChange(updatedFiles);
        }

        if (afterUpload) await afterUpload();
        return onChangeReturn;
      } catch (e) {
        console.error(e);
        throw e;
      } finally {
        setUploading(false);
      }
    }
    return [[], []];
  };

  const saveAll = async files => {
    const filesToDelete = files.filter((file: IAttachment) => file.ToDelete);

    for (const file of filesToDelete.values()) {
      if (file.$id) {
        await storage.deleteFile(kind, file.$id).catch(console.error);
      }
    }
    return uploadFiles(files);
  };

  const _onChange = (files: IAttachment[]) => {
    let updatedFiles = [...files];

    const serialized = updatedFiles
      .filter(f => !f.ToDelete)
      .map(file => JSON.stringify(fileSerialize(file)));

    if (onChange) {
      onChange(updatedFiles, serialized, directUpload, kind);
    }

    return [updatedFiles, serialized];
  };

  const onFilesAdded = (addedFiles: IAttachment[]) => {
    const adaptedAddedFiles = addedFiles.map((file: IAttachment) => {
      file.FileName = file.name;
      file.AttachmentKind = kind;
      file.isForUpload = true;
      return file;
    });

    _onChange([...value, ...adaptedAddedFiles]);
    if (directUpload && !uploading) uploadFiles(adaptedAddedFiles);
  };

  const removeFile = (file: IAttachment, index: number) => {
    let updatedFiles: IAttachment[];

    if (file.isForUpload) updatedFiles = value.filter(f => f !== file);
    else
      updatedFiles = value.map((f: any, i: number) => {
        if (i === index) {
          const updatedFile = { ...f };
          updatedFile.ToDelete = true;
          return updatedFile;
        }
        return f;
      });

    _onChange(updatedFiles);
  };

  const directRemoveFile = async (file: IAttachment) => {
    if (!confirm('¿Está seguro de remover?')) return;
    try {
      await storage.deleteFile(kind, file.$id!);
      if (afterDelete) afterDelete();
      _onChange([]);
    } catch (ex) {
      console.error(ex);
    }
  };

  const cancelRemove = (file: IAttachment, index: number) => {
    const updatedFiles = value.map((f: IAttachment, i: number) => {
      if (i === index) {
        const updatedFile = { ...f };
        updatedFile.ToDelete = false;
        return updatedFile;
      }
      return f;
    }) as any;

    _onChange(updatedFiles);
  };

  const openDialog = () => {
    !readOnly && el.current.open && el.current.open();
  };

  if (api) {
    api.uploadFiles = () => uploadFiles(value);
    api.saveAll = () => saveAll(value);
  }

  return {
    el,
    onFilesAdded,
    borderColor,
    setBorderColor,
    readOnly,
    openDialog,
    directRemove,
    directRemoveFile,
    files: value,
    kind,
    printMode,
    removeFile,
    cancelRemove,
    noButton
  };
};

export default useAttachments;
