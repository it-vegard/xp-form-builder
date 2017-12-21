const FormbuilderHeaderMenuToggle = (props) => (
  <button 
      className={"xpfb-admin-header-menu-toggle" + (props.isMenuOpen ? " toggled" : "")}
      onClick={props.onMenuToggleClick}>
    <span className="lines"></span>
  </button>
);

FormbuilderHeaderMenuToggle.displayName = "FormbuilderHeaderMenuToggle";

export default FormbuilderHeaderMenuToggle;