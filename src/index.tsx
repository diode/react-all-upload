import * as React from "react";
import { getBase64 } from "./utils";

const { useRef, useState, useEffect } = React;
export interface FileType {
  dataURL: string;
  file?: File;
  key?: string;
  onUpdate?: () => void;
  onRemove?: () => void;
}

export type FileListType = Array<FileType>;

export interface FileUploadingPropsType {
  children?: (props: ExportInterface) => React.ReactNode;
  defaultValue?: FileListType;
  onChange?: (value: FileListType) => void;
  multiple?: boolean;
  maxNumber?: number;
  acceptType?: Array<string>;
  maxFileSize?: number;
}

export interface ExportInterface {
  fileList: FileListType;
  onFileUpload: () => void;
  onFileRemoveAll: () => void;
  errors: Record<string, any>;
}

const fileTypes = {
  "png": "image/png",
  "gif": "image/png",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "bmp": "image/bmp",
  "mp4": "video/mp4",
  "webm": "video/webm",
  "avi": "video/avi",
  "doc": "application/msword",
  "docx": "application/msword",
  "pdf": "application/pdf",
}

const defaultErrors = {
  maxFileSize: false
};

const FileUploading: React.FC<FileUploadingPropsType> = ({
  multiple,
  onChange,
  maxNumber,
  children,
  defaultValue,
  acceptType,
  maxFileSize
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [fileList, setFileList] = useState(() => {
    let initFileList: Array<FileType> = [];
    if (defaultValue) {
      initFileList = defaultValue.map((item: FileType) => ({
        ...item,
        key: item.dataURL,
        onUpdate: (): void => onFileUpdate(item.dataURL),
        onRemove: (): void => onFileRemove(item.dataURL)
      }));
    }
    return initFileList;
  });

  // the "id unique" of the image that need update by new image upload
  const [keyUpdate, setKeyUpdate] = useState("");

  const [errors, setErrors] = useState({ ...defaultErrors });

  // for getting the latest fileList state
  const fileListRef = useRef(fileList);
  useEffect(() => {
    fileListRef.current = fileList;
  }, [fileList]);

  // export only fields that needed for user
  const onStandardizeDataChange = (list: FileListType): void => {
    if (onChange) {
      const sData: FileListType = list.map(item => ({
        file: item.file,
        dataURL: item.dataURL
      }));
      onChange(sData);
    }
  };

  // trigger input click
  const onFileUpload = (): void => {
    inputRef.current && inputRef.current.click();
  };

  // exported function
  const onFileRemoveAll = (): void => {
    setFileList([]);
    onStandardizeDataChange([]);
  };

  const onFileRemove = (key: string): void => {
    const updatedList: FileListType = fileListRef.current.filter(
      (item: FileType) => item.key !== key
    );
    setFileList(updatedList);
    onStandardizeDataChange(updatedList);
  };

  useEffect(() => {
    if (keyUpdate) {
      onFileUpload();
    }
  }, [keyUpdate]);

  const onFileUpdate = (key: string): void => {
    setKeyUpdate(key);
  };

  // read files and add some needed properties, func for update/remove actions
  const getListFile = (files: FileList): Promise<FileListType> => {
    const promiseFiles: Array<Promise<string>> = [];

    for (let i = 0; i < files.length; i++) {
      promiseFiles.push(getBase64(files[i]));
    }

    return Promise.all(promiseFiles).then((fileListBase64: Array<string>) => {
      const fileList: FileListType = fileListBase64.map((base64, index) => {
        const key = `${new Date().getTime().toString()}-${files[index].name}`;
        return {
          dataURL: base64,
          file: files[index],
          key,
          onUpdate: (): void => onFileUpdate(key),
          onRemove: (): void => onFileRemove(key)
        };
      });
      return fileList;
    });
  };

  const validate = (fileList: FileListType): boolean => {
    setErrors({ ...defaultErrors });
    if (maxFileSize) {
      for (let i = 0; i < fileList.length; i++) {
        // check size
        const file = fileList[i].file;
        if (file) {
          const size = Math.round(file.size / 1024 / 1024);
          if (maxFileSize && size > maxFileSize) {
            setErrors({ ...errors, maxFileSize: true });
            return false;
          }
        }
      }
    }
    return true;
  };

  const onInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const { files } = e.target;

    if (files) {
      const newFileList = await getListFile(files);
      if (newFileList.length > 0) {
        if (validate(newFileList)) {
          let updatedFileList: FileListType;
          if (keyUpdate) {
            updatedFileList = newFileList.map((item: FileType) => {
              if (item.key === keyUpdate) return { ...newFileList[0] };
              return item;
            });
            setKeyUpdate("");
          } else {
            if (multiple) {
              updatedFileList = [...fileList, ...newFileList];
              if (maxNumber && updatedFileList.length > maxNumber) {
                updatedFileList = fileList;
              }
            } else {
              updatedFileList = [newFileList[0]];
            }
          }
          setFileList(updatedFileList);
          onStandardizeDataChange(updatedFileList);
        } else {
        }
      } else {
        keyUpdate && setKeyUpdate("");
      }
    }
  };

  const acceptString =
    acceptType && acceptType.length > 0
      ? acceptType.map((type) => {
        let typeString = fileTypes[type] || type;
        return typeString;
      }).join(",")
      : "*/*";

  return (
    <>
      <input
        type="file"
        accept={acceptString}
        ref={inputRef}
        multiple={multiple && !keyUpdate}
        onChange={onInputChange}
        style={{ display: "none" }}
      />
      {children &&
        children({
          fileList,
          onFileUpload,
          onFileRemoveAll,
          errors
        })}
    </>
  );
};

FileUploading.defaultProps = {
  maxNumber: 1000,
  multiple: false,
  acceptType: []
};

export default FileUploading;
