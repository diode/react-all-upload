# React All Upload

A simple file uploader without UI extending [React-images-uploading by imvutoan](https://github.com/vutoan266/React-images-uploading)

## Install


## Usage

```tsx
import * as React from "react";

import FileUpload from "react-all-upload";

const maxNumber = 10;
const maxMbFileSize = 5;
class Example extends React.Component {
  onChange = fileList => {
    // data for submit
    console.log(fileList);
  };

  render() {
    return (
      <FileUpload
        onChange={this.onChange}
        maxNumber={maxNumber}
        multiple
        maxFileSize={maxMbFileSize}
        acceptType={["jpg", "gif", "png"]}
      >
        {({ fileList, onFileUpload, onFileRemoveAll }) => (
          // write your building UI
          <div>
            <button onClick={onFileUpload}>Upload File</button>
            <button onClick={onFileRemoveAll}>Remove all files</button>

            {fileList.map(file => (
              <div key={file.key}>
                {/^image/.test(file.type) ?<img src={file.dataURL} /> : <div>{file.name}</div>}
                <button onClick={file.onUpdate}>Update</button>
                <button onClick={file.onRemove}>Remove</button>
              </div>
            ))}
          </div>
        )}
      </FileUpload>
    );
  }
}
```

## Props

| parameter    | type     | options                | default | description                                           |
| ------------ | -------- | ---------------------- | ------- | ----------------------------------------------------- |
| multiple     | boolean  |                        | false   | Set true for multiple choose                          |
| maxNumber    | number   |                        | 1000    | Number of files user can select if mode = "multiple" |
| onChange     | function |                        |         | Called every update                                   |
| defaultValue | array    | [{dataURL: ... }, ...] |         | Init data                                             |
| acceptType   | array    | ['jpg', 'gif', 'png']  | []      | Supported file extension                             |
| maxFileSize  | number   |                        |         | Max file size(Mb) (will use in the file validation) |

## Exported options

| parameter                 | type     | description                                                               |
| ------------------------- | -------- | ------------------------------------------------------------------------- |
| fileList                  | array    | List of files for render. Each item in fileList has some options below. |
| fileList[index].key       | string   | Generate filename                                                         |
| fileList[index].dataURL   | string   | Url file or base64                                                       |
| fileList[index].onUpdate  | function | Call function for replace a new file on current position                 |
| fileList[index].onRemove  | function | Call function for remove current file                                    |
| onFileUpload              | function | Call for upload new file(s)                                              |
| onFileRemoveAll           | function | Call for remove all file(s)                                              |
| errors                    | object   | Export type of validation                                                 |

## License

MIT © [](https://github.com/)
