import Dropzone from 'react-dropzone';
import useAttachments, { type AttachmentsProps } from './useAttachments';
import { storage } from '@/core/appwriteClient';
import { BiCloudUpload } from 'react-icons/bi';
import { Button } from '@nextui-org/react';
import { PiX } from 'react-icons/pi';

const Attachments = (props: AttachmentsProps) => {
  const {
    el,
    onFilesAdded,
    borderColor,
    setBorderColor,
    readOnly,
    openDialog,
    files,
    kind,
    printMode,
    removeFile,
    directRemove,
    directRemoveFile,
    cancelRemove,
    noButton
  } = useAttachments(props);
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch'
      }}
    >
      <Dropzone
        ref={el}
        multiple
        onDrop={acceptedFiles => onFilesAdded(acceptedFiles as any)}
        noClick
        onDragEnter={() => setBorderColor('blue')}
        onDragLeave={() => setBorderColor('#e0e0e0')}
        onDropAccepted={() => setBorderColor('#e0e0e0')}
        onDropRejected={() => setBorderColor('#e0e0e0')}
        disabled={readOnly}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            style={{
              display: 'flex',
              flexDirection: 'column',
              margin: '2px 0',
              border: '3px dotted #e0e0e0',
              outline: 'none',
              borderColor
            }}
            tabIndex={-1}
            onDoubleClick={openDialog}
          >
            <input {...getInputProps()} style={{ display: 'none' }} />
            {files.map((file, index: number) => {
              let href: string | undefined = undefined;
              if (file.$id) {
                href = storage.getFileDownload(kind, file.$id!).href;
                if (
                  ['.jpg', '.gif', '.png'].some(ext =>
                    file.FileName.endsWith(ext)
                  )
                )
                  href = storage.getFilePreview(kind, file.$id!).href;

                if (['.pdf'].some(ext => file.FileName.endsWith(ext)))
                  href = storage.getFileView(kind, file.$id!).href;
              }
              return (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    flexWrap: 'nowrap',
                    borderBottom: '1px solid #e0e0e0',
                    padding: 0,
                    paddingLeft: 3
                  }}
                  key={file.FileName}
                >
                  {file.isForUpload && (
                    <BiCloudUpload style={{ margin: '0 2px' }} />
                  )}
                  <div
                    style={{
                      padding: '0 2px',
                      minWidth: 0,
                      height: 24
                    }}
                  >
                    <a
                      target="_blank"
                      rel="noreferrer"
                      href={href}
                      style={{
                        cursor: 'pointer',
                        textDecoration: file.ToDelete
                          ? 'line-through'
                          : 'initial',
                        color: file.ToDelete ? 'red' : '#337ab7',
                        width: '100%',
                        display: 'inline-block',
                        lineHeight: 1.4
                      }}
                    >
                      <div
                        style={{ overflow: 'hidden', padding: 0, minWidth: 0 }}
                      >
                        <span className={'text-nowrap ' + file.status}>
                          {file.FileName}
                        </span>
                      </div>
                    </a>
                  </div>
                  {!printMode && !readOnly && !file.ToDelete && (
                    <Button
                      isIconOnly
                      size="sm"
                      color="primary"
                      variant="light"
                      className="h-4 p-0"
                      onClick={() => {
                        if (directRemove) {
                          directRemoveFile(file);
                        } else {
                          removeFile(file, index);
                        }
                      }}
                    >
                      <PiX style={{ fontSize: '1em' }} />
                    </Button>
                  )}
                  {!printMode && !readOnly && file.ToDelete && (
                    <Button
                      size="sm"
                      variant="light"
                      className="h-5"
                      style={{ fontSize: '.6em' }}
                      color="secondary"
                      onClick={() => cancelRemove(file, index)}
                    >
                      (cancelar remover)
                    </Button>
                  )}
                </div>
              );
            })}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                flexWrap: 'nowrap'
              }}
            >
              {!readOnly && !noButton && (
                <div>
                  <Button
                    className="hidden-print"
                    // variant="contained"
                    color="primary"
                    size="sm"
                    onClick={openDialog}
                    style={{ margin: 3, fontSize: '.65em', padding: 1 }}
                  >
                    Adjuntar
                  </Button>
                </div>
              )}
              {!files.length && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: 0
                  }}
                >
                  <span className="text-center text-nowrap">Sin Archivos</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Dropzone>
    </div>
  );
};

export default Attachments;
