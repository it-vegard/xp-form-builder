export const createForm = () => ({
  type: 'CREATE_FORM'
});

export const editForm = (id) => ({
  type: 'EDIT_FORM',
  id
});

export const deleteForm = (id) => ({
  type: 'DELETE_FORM',
  id
});