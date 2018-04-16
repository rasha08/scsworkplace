import React from 'react';

const FormTextAreaField = props => {
  const getTextAreaNumberOfRows = value => {
    if (!value) {
      return false;
    }

    let defaultNumOfRows = props.value.length / 90;

    return defaultNumOfRows < 3 ? 3 : defaultNumOfRows;
  };

  return (
    <div className="form-group">
      <label>{`${props.type} ${props.fieldName}`}</label>
      <textarea
        rows={getTextAreaNumberOfRows(props.value)}
        className="form-control"
        id={props.filedName}
        placeholder={`${props.type} ${props.fieldName}`}
        value={props.value}
        onChange={event => props.updateFieldValue(event, props.fieldName)}
        onBlur={event => props.handleChange(event)}
      />
    </div>
  );
};

export default FormTextAreaField;
