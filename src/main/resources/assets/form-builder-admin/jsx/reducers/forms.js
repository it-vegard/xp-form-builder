import defaultStore from '../store/store';

const form = (state, action) => {
  switch (action.type) {
    case 'CREATE_FORM':
      return {
        title: undefined,
        inputFields: []
      }
    default:
      return state
  }
}

const forms = (state = defaultStore, action) => {
  console.log("FormsReducer called with state=", state, ' and action=', action);
  switch (action.type) {
    case 'CREATE_FORM':
      return Object.assign({}, state, form(undefined, action))
    case 'EDIT_FORM':
      return Object.assign({}, state, {
        "editForm": action.id
      })
    case 'DELETE_FORM':
      let newState = Object.assign({}, state);
      delete newState.forms[action.id];
      return newState;
    default:
      return state
  }
}

export default forms;