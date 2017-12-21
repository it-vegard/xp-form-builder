import FormSettingsEditor from './FormSettingsEditor';
import FormFieldsEditor from './FormFieldsEditor';
import AddInputButton from './AddInputButton';
import { connect } from 'react-redux';
import { Field, FormSection, reduxForm } from 'redux-form';

const addInputElement = () => {
  FormEditor.registerField('my-first-form', 'text', 'Field');
};

const forceNameFormat = string => {
  if (!string || string instanceof "string") {
    return "";
  } else {
    return string.toLowerCase().replace(' ', '-').replace(/([^\d]*)(\d*)([^\w]*)/, '');
  }
};

let FormEditor = (props) => (
  <form className="xp-formbuilder-editor">
    {props.currentForm && props.currentForm.inputFields && props.currentForm.inputFields.map((input) => {
      const inputName = input.title;
      return(
        <FormSection name={inputName}>
          <fieldset>
            <legend>{input.title}</legend>
            {input && input.properties && Object.keys(input.properties).map((key, index) => {
              const inputField = input.properties[key];
              return (
                <div>
                  <label htmlFor={`${inputName}-${key}`}>{key}</label>
                  <Field name={`${inputName}-${key}`} component="input" type={inputField.type}/>
                </div>
              );
            })}
          </fieldset>
        </FormSection>
      );
    })}
    <label htmlFor="name">Name</label>
    <Field name="name" component="input" type="texts"/>
    <AddInputButton onClick={addInputElement}/>
  </form>
);

FormEditor.displayName = "FormEditor";

FormEditor = reduxForm({
  form: 'my-first-form'
})(FormEditor);

FormEditor = connect(
  (state, props) => ({
    initialValues: state.forms.initialValues,
    currentForm: props.currentForm
  })
)(FormEditor);

export default FormEditor;