const TextInputEditor = (props) => (
  <div className="xp-formbuilder-editor-text-input">
    <label htmlFor={"form-" + props.name}>{props.label}</label>
    <input id={"form-" + props.name} name={"form-" + props.name} type="text" />
  </div>
);

TextInputEditor.displayName = "TextInputEditor";

export default TextInputEditor;