import CreateInputFieldContainer from './CreateInputFieldContainer';
import AddInputButton from './AddInputButton';

const FormFieldsEditor = (props) => (
  <div className="xp-formbuilder-editor-formfields">
    {props.inputFields.map((inputField, index) => {
        return <CreateInputFieldContainer key={index} label={inputField.label} name={inputField.name}/>
    })}
  </div>
);

FormFieldsEditor.displayName = "FormFieldsEditor";

export default FormFieldsEditor;