import React from 'react';
import NavigationBar from './NavigationBar';
import { connect } from 'react-redux';

const links = [
  { 
    linkText: "New",
    target: "",
    onClickHandler: (e) => {
      e.preventDefault();
      alert("New");
    }
  },
  { 
    linkText: "Edit",
    target: ""
  },
  { 
    linkText: "Duplicate",
    target: ""
  },
  { 
    linkText: "Delete",
    target: ""
  }
];

const FormBuilderNavigation = (props) => (
  <NavigationBar links={links}/>
);

FormBuilderNavigation.displayName = "FormBuilderNavigation";

const mapStateToProps = (state, props) => {
  return {
    ...props
  };
};

export default connect(mapStateToProps)(FormBuilderNavigation);