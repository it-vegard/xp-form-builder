import React from 'react';
import FormItem from './FormItem';

const FormContentTree = (props) => (
  <ul className="overview-navigation-forms">
    {props.forms.map((form) => {
      return (<FormItem key={form.id} {...form}/>)
    })}
  </ul>
);

FormContentTree.displayName = "FormContentTree";

export default FormContentTree;