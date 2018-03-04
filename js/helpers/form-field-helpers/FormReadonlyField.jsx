import React from 'react';

const FormReadOnlyField = props => (
  <div className="form-group col-md-12">
    <label>{`${props.type} ${props.fieldName}`}</label>
    <input
      type={props.fieldType}
      className="form-control"
      id={props.filedName}
      value={props.value}
      onChange={() => {}}
      disabled
    />
  </div>
)

export default FormReadOnlyField;

