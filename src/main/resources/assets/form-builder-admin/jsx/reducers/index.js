import { combineReducers } from 'redux';
import forms from './forms';
import admin from './admin';
import menu from './menu';
import { reducer as form } from 'redux-form'

const formBuilderAdmin = combineReducers({
  form,
  forms,
  admin,
  menu
});

export default formBuilderAdmin;