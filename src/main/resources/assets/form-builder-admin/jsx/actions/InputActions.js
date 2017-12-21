export const addInput = (position) => ({
  type: 'ADD_INPUT',
  position
});

export const editInput = (id) => ({
  type: 'EDIT_INPUT',
  id
});

export const saveInput = (id, form) => ({
  type: 'SAVE_INPUT',
  id,
  form
});

export const moveInput = (id, oldPosition, newPosition) => ({
  type: 'MOVE_INPUT',
  id,
  oldPosition,
  newPosition
});

export const deleteInput = (id) => ({
  type: 'DELETE_INPUT',
  id
});