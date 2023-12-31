import { type IAttachment } from './useAttachments';

export const fileSerialize = (file: IAttachment) => {
  return [file.$id, file.FileName];
};

export const fileDeserialize = (file: string) => {
  const parsedFile = JSON.parse(file);
  return {
    $id: parsedFile[0],
    FileName: parsedFile[1],
    isForUpload: false,
    name: parsedFile[1],
    ToDelete: false,
    status: ''
  } as IAttachment;
};
