const formEditorApp = (state = {}, action) => {
  switch (action.type) {
    case 'EDIT_FORM':
      return state.forms[action.id]
    default:
      return state;
  }
};

const defaultAdminState = {
  toolbar: {
    links: [
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
    ]
  },
  showViews: {
    'formEditor': true,
    'formOverview': false
  },
  activeForm: null
};

const adminApp = (state = defaultAdminState, action) => {
  console.log("AdminAppReducer called with state=", state, ' and action=', action);
  switch (action.type) {
    case 'NEW_FORM':
      return {
        ...state,
        showViews: {
          'formEditor': true,
          'formReporting': false
        },
        activeForm: {}
      };
    case 'EDIT_FORM':
      return {
        ...state,
        showViews: {
          'formEditor': true,
          'formReporting': false
        },
        activeForm: formEditorApp(state, action)
      };
    case 'CLOSE_EDITOR':
      return {
        ...state,
        showViews: {
          'formEditor': false,
          'formReporting': true
        }
      };
    case 'DELETE_FORM':
      return {
        ...state,
        showViews: {
          'formEditor': false,
          'formReporting': true
        }
      }
    default:
      return state
  }
}

export default adminApp;