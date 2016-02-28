'use strict';

var XP_LIST_UTIL = {
  asList:  function(listOrObject) {
    if (Object.prototype.toString.call(listOrObject) === '[object Array]') {
      return listOrObject;
    } else if (listOrObject !== undefined) {
      return [listOrObject];
    } else {
      return [];
    }
  },
  iterateSafely: function(listOrObject, handler) {
    var list = XP_LIST_UTIL.asList(listOrObject);
    for (var i = 0; i < list.length; i++) {
      handler(list[i]);
    }
  },
  forEach: function(list, handler) {
    for (var i = 0; i < list.length; i++) {
      handler(list[i]);
    };
  }
};


var XP_FORM_BUILDER = {
  initializeForm: function(event) {
    XP_FORM_BUILDER.initializeCheckboxes(document.getElementsByClassName("indeterminate"));
  },
  initializeCheckboxes: function(checkboxes) {
    XP_LIST_UTIL.forEach(checkboxes, function(checkbox) {
      checkbox.indeterminate = true;
    });
  },
  addSubmitHandling: function(form) {
    var forms = document.getElementsByClassName("xp-formbuilder-form");
    for (let i = 0; i < forms.length; i++) {
      let currentForm = forms[i];
      if (currentForm.className.indexOf("ajax-submit") > -1) {
      currentForm.onsubmit = XP_FORM_BUILDER.submitForm;
      }
    }
  },
  submitForm: function(event) {
    event.preventDefault();
    let inputFields = this.getElementsByTagName("input");
    let formData = XP_FORM_BUILDER.prepareFormData(inputFields);
    XP_FORM_BUILDER.disable(this);
    XP_FORM_BUILDER.sendForm(event.target, formData);
  },
  disable: function(form) {
    let inputElements = form.getElementsByClassName("xp-input");
    for (var i = 0; i < inputElements.length; i++) inputElements[i].disabled = true;
    form.getElementsByClassName("xp-submit")[0].disabled = true;
    form.className = (form.className) ? form.className + " xp-submitting" : "xp-submitting";
  },
  prepareFormData: function(inputFields) {
    let formData = new FormData();
    for (let i = 0; i < inputFields.length; i++) {
      let inputField = inputFields[i];
      if (inputField.type === "file") {
        XP_FORM_BUILDER.addFiles(inputField, formData);
      } else 
      if (inputField.type === "radio" && inputField.checked !== true) {
        continue; // Don't add unchecked radiobuttons.
      } else if (inputField.type === undefined && inputField.for !== undefined && inputField.attributes.name.value) {
        continue; // Don't add display field for range input. Use the range-value instead.
      } else if (inputField.type === "submit" || inputField.type === "reset" || !inputField.id) {
        continue; // Don't add submit or reset-buttons.
      } else {
        formData.append(inputField.id, inputField.value);
      }
    }
    return formData;
  },
  addFiles: function(inputField, formData) {
    for (let i = 0; i < inputField.files.length; i++) {
      let file = inputField.files[i];
      if (XP_FORM_BUILDER.validateFile(file)) {
        formData.append(inputField.id + "[" + i + "]", file, file.name);
      }
    }
  },
  sendForm: function(form, formData) {
    let xhr = new XMLHttpRequest();
    xhr.open('POST', form.action, true);
    xhr.onload = function(response) {
      if (xhr.status === 200) {
        XP_FORM_BUILDER.addResponse(form, response.srcElement.responseText);
        form.remove();
      } else {
        console.log("Error: Failed submitting form.");
      }
    };
    xhr.send(formData);
  },
  validateFile: function(file) {
    return true;
  },
  addResponse: function(form, message) {
    let responseTag = document.createElement("p");
    responseTag.className = "xp-form-response";
    responseTag.innerHTML = message;
    form.parentElement.insertBefore(responseTag, form);
  }
};

var XP_FORM_APP = {
  onLoad: function(method) {
    if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', method);
    } else if (window.attachEvent) {
      window.attachEvent('load', method);
    } else {
      window.addEventListener('load', method);
    }
  }
}

XP_FORM_APP.onLoad(XP_FORM_BUILDER.initializeForm);
XP_FORM_APP.onLoad(XP_FORM_BUILDER.addSubmitHandling);