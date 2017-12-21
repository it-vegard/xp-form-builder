import React from 'react';
import FormPreview from './../../preview/FormPreview';
import FormEditor from './../../editor/FormEditor';

const FormBuilderMain = (props) => (
  <div className="formbuilder-main">
    <FormEditor currentForm={props.currentForm}/>
    <FormPreview/>
  </div>
);

FormBuilderMain.displayName = "FormBuilderMain";

export default FormBuilderMain;