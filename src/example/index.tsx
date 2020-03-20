import * as React from "react";
import * as ReactDOM from "react-dom";
import FileUpload, { FileListType } from "../index";
import "./styles.css";

function Example() {
  const maxNumber = 69;
  const maxMbFileSize = 5;
  const onChange = (fileList: FileListType) => {
    // data for submit
    console.log(fileList);
  };
  return (
    <div className="App">
      <FileUpload
        onChange={onChange}
        maxNumber={maxNumber}
        multiple
        maxFileSize={maxMbFileSize}
        acceptType={["jpg", "gif", "png"]}
      >
        {({ fileList, onImageUpload, onImageRemoveAll }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <button onClick={onImageUpload}>Upload images</button>&nbsp;
            <button onClick={onImageRemoveAll}>Remove all images</button>
            {fileList.map(file => (
              <div key={file.key} className="image-item">
                <img src={file.dataURL} alt="" width="100" />
                <div className="image-item__btn-wrapper">
                  <button onClick={file.onUpdate}>Update</button>
                  <button onClick={file.onRemove}>Remove</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </FileUpload>
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Example />, rootElement);
