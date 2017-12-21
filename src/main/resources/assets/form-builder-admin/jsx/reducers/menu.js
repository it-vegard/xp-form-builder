const defaultState = {
  isMenuOpen: false
}

const menu = (state = defaultState, action) => {
  switch (action.type) {
    case 'TOGGLE_MENU':
      return {
        ...state,
        isMenuOpen: !isMenuOpen
      }
    default:
      return state
  }
}

export default menu;