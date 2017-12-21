import React from 'react';
import ReactDOM from 'react-dom';
import * as formbuilder from '../less/formbuilder.less';

class FormBuilderAdmin extends React.Component {
  render() {
    return (
      <div>
        <h2>A form builder for Enonic XP</h2>
      </div>
    );
  }
}

ReactDOM.render(<FormBuilderAdmin/>, document.getElementById('formBuilderAdminContainer'));