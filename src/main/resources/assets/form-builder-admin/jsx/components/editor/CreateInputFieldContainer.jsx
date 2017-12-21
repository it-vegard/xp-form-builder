import TextInputEditor from "./inputs/TextInputEditor";
import AddInputButton from './AddInputButton';

const CreateInputFieldContainer = (props) => (
  <div className="xp-formbuilder-editor-formfields-inputs">
    <p className="xp-formbuilder-editor-formfields-input-heading">{"Add new input"}</p>
    <TextInputEditor label="Label" name="label"/>
    <TextInputEditor label={props.label} name={props.name}/>
    <AddInputButton modifier={AddInputButton.Modifiers.THIN} />
  </div>
);

CreateInputFieldContainer.displayName = "CreateInputFieldContainer";

export default CreateInputFieldContainer;