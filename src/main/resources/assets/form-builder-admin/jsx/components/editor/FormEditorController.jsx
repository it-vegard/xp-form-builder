import React from 'react';
import FormEditor from './FormEditor';

const formConfig = {
  formSettings: [
    {
      label: "Title",
      name: "title"
    }
  ],
  inputFields: [
    {
      label: "Label",
      name: "label"
    },
    {
      label: "Tooltip",
      name: "tooltip"
    },
    {
      label: "Placeholder",
      name: "placeholder"
    },
    {
      label: "Class",
      name: "class"
    },
    {
      label: "Name",
      name: "name"
    },
    {
      label: "Default value",
      name: "default"
    }
  ]
}

const FormEditorController = (props) => (
  props.isEditing && <FormEditor config={formConfig} />
);

FormEditorController.displayName = "FormEditorController";

export default FormEditorController;