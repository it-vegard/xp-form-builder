import FormbuilderHeaderHome from './FormbuilderHeaderHome';
import FormbuilderHeaderMenu from './FormbuilderHeaderMenu';
import { connect } from 'react-redux';

const FormbuilderHeader = (props) => (
  <div className="xpfb-admin-header">
    <FormbuilderHeaderHome appName={props.config.appName} />
    <FormbuilderHeaderMenu isMenuOpen={props.isMenuOpen} onMenuToggleClick={props.onMenuToggleClick} />
  </div>
);

FormbuilderHeader.displayName = "FormbuilderHeader";

const mapStateToProps = (state, props) => {
  return {
    isMenuOpen: state.menu.isMenuOpen
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    ...props,
    onMenuToggleClick: () => {
      dispatch({
        type: "TOGGLE_MENU"
      })
    }
  }
}

export default connect(mapStateToProps)(FormbuilderHeader);