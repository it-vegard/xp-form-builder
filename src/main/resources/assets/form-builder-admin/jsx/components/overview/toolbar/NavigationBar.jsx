import NavigationLink from './NavigationLink';

const NavigationBar = (props) => {
  <nav className="xp-formbuilder-navigation">
    <ul className="xp-formbuilder-navigation-toolbar">
      { props.links.map((link, index) => (
        <NavigationLink
          key={index}
          linkText={link.linkText}
          target={link.target}
          onClickHandler={link.onClickHandler} />
      ))}
    </ul>
  </nav>
};

NavigationBar.displayName = "NavigationBar";

export default NavigationBar;