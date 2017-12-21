const clickHandler = (e) => {
  let index = e.target.getAttribute("data-index");
  alert("Insert field at position " + index);
};

const prepareElementClass = (modifier) => {
  let baseClass = "xp-formbuilder-editor-addinputbutton";
  return (modifier === AddInputButton.Modifiers.THIN) ? baseClass + " xp-formbuilder-editor-addinputbutton-thin" : baseClass;
};

const AddInputButton = (props) => (
  <button 
    className={prepareElementClass(props.modifier)}
    data-index="1"
    onClick={props.onClick}
  >
    {"Add input field"}
  </button>
);

AddInputButton.displayName = "AddInputButton";

AddInputButton.Modifiers = {
  THIN: "thin"
};

export default AddInputButton;