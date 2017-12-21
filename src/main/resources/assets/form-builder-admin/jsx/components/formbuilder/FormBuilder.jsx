import React from 'react';
import FormBuilderMain from './main/FormBuilderMain';
import FormBuilderToolbar from './toolbar/FormBuilderToolbar';
import { connect } from 'react-redux';

const FormBuilder = (props) => {
  return (props.showFormBuilder === true) ? (
    <div className="formbuilder">
      <FormBuilderToolbar />
      <FormBuilderMain currentForm={props.currentForm}/>
    </div>
  ) : null;
};

FormBuilder.displayName = "FormBuilder";

const mapStateToProps = (state, props) => {
  return {
    ...props,
    currentForm: state.forms.formList[0],
    showFormBuilder: state.admin.showViews.formEditor
  };
};

export default connect(mapStateToProps)(FormBuilder);