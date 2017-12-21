const goToTarget = (event) => {
  window.location.href = event.target["data-target"];
};

const NavigationLink = (props) => (
  <li className="xp-formbuilder-navigation-toolbar-element">
    <button 
      className="xp-formbuilder-navigation-toolbar-button"
      data-target={props.target} 
      onClick={props.onClickHandler || goToTarget} >
      {props.linkText}
    </button>
  </li>
  );

NavigationLink.displayName = "NavigationLink";

export default NavigationLink;