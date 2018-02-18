import React from 'react';
import { map, capitalize, filter } from 'lodash';

const FormSelect = props => {
  return (
    <select
      className="form-control"
      onChange={change => props.handleSelectChange(change)}
    >
      {props.selected
        ? <option value={props.selected} key={props.selected}>
            {capitalize(props.selected)}
          </option>
        : <option value="">
            Select {`${props.type}`} {`${props.selectName}`}
          </option>}
      {map(
        filter(props.options, option => option !== props.selected),
        option => (
          <option value={option} key={option}>{capitalize(option)}</option>
        )
      )}
    </select>
  );
};

export default FormSelect;
