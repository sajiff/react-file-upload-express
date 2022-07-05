import React, { Fragment } from "react";
import { useState } from "react";
import axios from "axios";
import Message from "./Message";
import Progress from "./Progress";

const FileUpload = () => {
  const [file, setfile] = useState("");
  const [uploadedFile, setuploadedFile] = useState({});
  const [message, setmessage] = useState("");
  const [uploadPercentage, setuploadPercentage] = useState(0);

  const onChange = (e) => {
    setfile(e.target.files[0]);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("file", file);

    try {
      const res = await axios.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          setuploadPercentage(
            parseInt(
              Math.round(progressEvent.loaded * 100) / progressEvent.total
            )
          );
          //clear percentage
          setTimeout(() => {
            setuploadPercentage(0);
          }, 10000);
        },
      });

      console.log(res.data);
      const { fileName, filePath } = res.data;

      setuploadedFile({ fileName, filePath });
      setmessage("File Uploaded");
    } catch (error) {
      if (error.response.status === 500) {
        setmessage("there was an error with server");
      } else {
        setmessage(error.response.data.msg);
      }
    }
  };
  return (
    <Fragment>
      {message ? <Message msg={message} /> : null}
      <form onSubmit={onSubmit}>
        <div className="input-group mb-4">
          <input type="file" className="form-control" onChange={onChange} />
          {/* <label className="input-group-text" htmlFor="inputGroupFile02">
            {filename}
          </label> */}
        </div>
        <Progress percentage={uploadPercentage} />
        <input
          type="submit"
          value="Upload"
          className="btn btn-primary btn-block mt-4 flex"
          style={{ width: "100%" }}
        />
      </form>
      {uploadedFile ? (
        <div className="row mt-5">
          <div className="col-md-6 m-auto">
            <h3 className="text-center">{uploadedFile.fileName}</h3>
            <img
              style={{
                width: "100%",
              }}
              src={`${process.env.REACT_APP_API_KEY}/${uploadedFile.filePath}`}
              alt=""
            />
          </div>
        </div>
      ) : null}
    </Fragment>
  );
};

export default FileUpload;
