import React from 'react';

const FormItem = (props) => (
  <li className="overview-navigation-form-item">
    <input type="checkbox" id={`overview-list-form-${props.id}`}/>
    <label htmlFor={`overview-list-form-${props.id}`}>{props.displayName}</label>
  </li>
);

FormItem.displayName = "FormItem";

export default FormItem;
