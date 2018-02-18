import React from 'react';

const FormField = props => {
  return (
    <div className="form-group col-md-12">
      <label>{`${props.type} ${props.fieldName}`}</label>
      <input
        type={props.fieldType}
        className="form-control"
        id={props.filedName}
        placeholder={`${props.type} ${props.fieldName}`}
        onBlur={event => props.handleChange(event)}
      />
    </div>
  );
};

export default FormField;
