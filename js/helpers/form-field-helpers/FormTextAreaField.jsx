import React from 'react';

const FormTextAreaField = props => {
  return (
    <div className="form-group">
      <label>{`${props.type} ${props.fieldName}`}</label>
      <textarea
        className="form-control"
        id={props.filedName}
        placeholder={`${props.type} ${props.fieldName}`}
        value={props.value}
        onChange={event => props.updateFieldValue(event, props.fieldName)}
        onBlur={event => props.handleChange(event)}
      />
    </div>
  )
}

export default FormTextAreaField;