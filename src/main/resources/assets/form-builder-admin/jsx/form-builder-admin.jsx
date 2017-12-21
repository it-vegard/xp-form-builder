import React from 'react';
import { render } from 'react-dom';
import FormEditorController from './components/editor/FormEditorController';
import FormbuilderHeader from './components/header/FormBuilderHeader';
import FormPreview from './components/preview/FormPreview';
import Overview from './components/overview/Overview';
import Formbuilder from './components/formbuilder/Formbuilder';
import * as styles from '../less/all.less';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers';

const config = {
  appName: "Formbuilder"
}

const store = createStore(reducer, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

console.log("state=", store.getState());

render (
  <Provider store={store}>
    <div className="xp-formbuilder-app">
      <FormbuilderHeader config={config} />
      <Overview/>
      <Formbuilder />
      {/*<main className="xp-formbuilder-grid">
        <FormEditorController isEditing={true} />
        <FormPreview />
      </main>*/}
    </div>
  </Provider>,
  document.getElementById('formBuilderAdminContainer')
);