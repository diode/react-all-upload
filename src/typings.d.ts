import { ExportInterface } from "./index";

export interface ImageType {
  dataURL: string;
  file?: File;
  key?: string;
  onUpdate?: () => void;
  onRemove?: () => void;
}

export type ImageListType = Array<ImageType>;

export interface ImageUploadingPropsType {
  children?: (props: ExportInterface) => React.ReactNode;
  defaultValue?: ImageListType;
  onChange?: (value: ImageListType) => void;
  mode?: "single" | "multiple";
  maxNumber?: number;
}
