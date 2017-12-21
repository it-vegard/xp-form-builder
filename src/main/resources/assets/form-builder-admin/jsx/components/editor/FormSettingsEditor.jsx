import TextInputEditor from "./inputs/TextInputEditor";

const FormSettingsEditor = (props) => (
  <div className="xp-formbuilder-editor-settings">
    {props.config && props.config.map((formField, index) => {
      return (<TextInputEditor label={formField.label} name={formField.name} key={index}/>);
    })}
  </div>
);

FormSettingsEditor.displayName = "FormSettingsEditor";

export default FormSettingsEditor;