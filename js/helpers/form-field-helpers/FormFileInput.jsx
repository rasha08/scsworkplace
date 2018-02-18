import React from 'react';
import Alert from '../Alert';

const FormFileInput = props => {
  return (
    <div>
      <div className="custom-file col-md-12">
        <input
          type="file"
          className="custom-file-input"
          id="customFile"
          onChange={event => props.handleImageUpload(event)}
        />
        <label className="custom-file-label">
          Upload Image...
        </label>
      </div>
      <div className="col-md-6">
        {
          props.fileUploadState ?
            <Alert
              type="success"
              message="Your Image is Successfully uploaded"
            /> :

            <div />
        }
      </div>
    </div>
  )
}

export default FormFileInput;