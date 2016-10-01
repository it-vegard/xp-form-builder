var portal = require('/lib/xp/portal'); // Import the portal functions
var contentLib = require('/lib/xp/content'); // Import the portal functions

var LIST_UTIL = require('/lib/form-builder/list-util');

exports.initForm = function (formConfig) {
  var form = {
    id: formConfig.id || null,
    title: formConfig.title || null,
    submitText: formConfig.submitText || "Submit",
    actionUrl: formConfig.actionUrl || portal.componentUrl({}),
    method: formConfig.method || "post",
    ajax: formConfig.useAjax || false,
    inputs: []
  };
  LIST_UTIL.iterateSafely(formConfig.inputs, function(inputId) {
    var inputContent = contentLib.get({key: inputId});
    if (inputContent !== null) {
      var input = {};
      var inputName = inputContent.data.name || inputContent._name;
      inputContent.data.id = formatName(inputName);
      inputContent.data.name = formatName(inputName);
      addCommonInputValues(input, inputContent.data);
      addCustomInputValues(input, inputContent.type, inputContent.data);
      input.class = (input.class) ? input.class + " xp-input" : "xp-input";
      input.class.trim();
      form.inputs.push(input);
      if (getInputType(inputContent.type) === "file") form.enctype = "multipart/form-data";
    } else {
      log.error("Could not retrieve input element with ID '" + inputId + "'.");
    }
  });
  return form;
};

var addCommonInputValues = function(input, inputContent) {
  input.id = inputContent.id || inputContent.name;
  input.name = inputContent.name; // required
  input.label = inputContent.label; // required
  input.title = inputContent.title;
  input.help = inputContent.help;
  input.class = inputContent.class;
  if (inputContent.required) {
    input.labelClass = "required";
    input.required = inputContent.required;
  }
};

var addCustomInputValues = function(input, inputType, inputContent) {
  inputType = getInputType(inputType);
  input.type = inputType;
  switch (inputType) {
    case "checkbox":
      initCheckboxInput(input, inputContent);
      break;
    case "color":
      initColorInput(input, inputContent);
      break;
    case "date":
      initDateInput(input, inputContent);
      break;
    case "datetime":
      initDateTimeInput(input, inputContent);
      break;
    case "email":
      initEmailInput(input, inputContent);
      break;
    case "file":
      initFileInput(input, inputContent);
      break;
    case "hidden":
      initHiddenInput(input, inputContent);
      break;
    case "number":
      initNumberInput(input, inputContent);
      break;
    case "password":
      initPasswordInput(input, inputContent);
      break;
    case "radio":
      initRadioInput(input, inputContent);
      break;
    case "range":
      initRangeInput(input, inputContent);
      break;
    case "search":
      initSearchInput(input, inputContent);
      break;
    case "tel":
      initTelInput(input, inputContent);
      break;
    case "text":
      initTextInput(input, inputContent);
      break;
    case "time":
      initTimeInput(input, inputContent);
      break;
    case "url":
      initUrlInput(input, inputContent);
      break;
  }
};

/* Button input */
var initButtonInput = function(input, inputContent) {
  /* TODO */
};

/* Checkbox input */
var initCheckboxInput = function(input, inputContent) {
  if (inputContent.state === "checked") {
    input.checked = (input.class) ? input.class + " checked" : "checked";
  } else if (inputContent.state === "indeterminate") {
    input.class = (input.class) ? input.class + " indeterminate" : "indeterminate";
  }
  input.value = inputContent.value;
  input.text = inputContent.text;
};

/* Color input */
var initColorInput = function(input, inputContent) {
  input.title = inputContent.title || null;
  var colorOptions = LIST_UTIL.asList(inputContent.colorList.hexValues);
  input.placeholder = colorOptions[0] || "#000000";
  input.value = colorOptions[0] || "#000000";
  addColorInputsAsDatalist(input, inputContent);
};

/* Date input */
var initDateInput = function(input, inputContent) {
  input.min = inputContent.min;
  input.max = inputContent.max;
  input.value = inputContent.value;
};

/* Datetime input */
var initDateTimeInput = function(input, inputContent) {
  input.min = inputContent.min;
  input.max = inputContent.max;
  input.value = inputContent.value;
};

/* Email input */
var initEmailInput = function(input, inputContent) {
  input.placeholder = inputContent.placeholder || null;
  input.pattern = input.pattern || "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$";
};

/* File input */
var initFileInput = function(input, inputContent) {
  if (inputContent.accept && inputContent.accept.length !== 0) {
    input.accept = "";
    LIST_UTIL.iterateSafely(inputContent.accept, function(acceptedFormat) {
      if (input.accept !== "") input.accept += ";";
      input.accept += acceptedFormat;
    });
  }
  if (supportsCapture(input.accept)) {
    input.capture = true;
  }
  input.multiple = inputContent.multiple;
};

/* Hidden input */
var initHiddenInput = function(input, inputContent) {
  input.value = inputContent.value;
};

/* Number input */
var initNumberInput = function(input, inputContent) {
  input.placeholder = inputContent.placeholder || null;
  input.min = inputContent.min;
  input.max = inputContent.max;
  input.step = inputContent.step;
  if (inputContent.disableAutocomplete === true) {
    input.autocomplete = 'autocomplete';
  }
  // TODO: Add list?
};

/* Password input */
var initPasswordInput = function(input, inputContent) {
  input.placeholder = inputContent.placeholder || null;
  input.minlength = input.minlength; // Not yet implemented (in browsers)
  input.maxlength = input.maxlength;
  input.size = input.size;
  input.inputMode = input.inputMode; // Not yet implemented (in browsers)
  input.pattern = input.pattern || ".*";
};

/* Radio input */
var initRadioInput = function(input, inputContent) {
  input.options = [];
  for (var i = 0; i < inputContent.options.length; i++) {
    input.options[i] = {
      value: inputContent.options[i].optionValue || null,
      text: inputContent.options[i].optionText || null,
      checked: inputContent.options[i].optionChecked || false
    };
  }
};

/* Range input */
var initRangeInput = function(input, inputContent) {
  input.min = inputContent.min;
  input.max = inputContent.max;
  input.value = inputContent.value;
  input.step = inputContent.step;
  input.output = inputContent.name + "_output";
  var ticks = LIST_UTIL.asList(inputContent.ticks);
  if (ticks.length > 0) { // Prefer ticks as values
    input.datalist = {
      id: input.id + "-datalist",
      options: []
    };
    for (var i = 0; i < ticks.length; i++) {
      input.datalist.options[i] = {
        label: ticks[i],
        value: ticks[i]
      };
    };
  } else if (inputContent.min !== undefined && inputContent.max !== undefined && inputContent.step !== undefined) { // Fall back to generate datalist based on max, min and step
    input.datalist = {
      id: input.id + "-datalist",
      options: []
    };
    for (var i = inputContent.min; i <= inputContent.max; i = i + inputContent.step) {
      input.datalist.options.push({
        label: i,
        value: i,
        selected: i === inputContent.value ? true : undefined
      });
    }
  }
};

/* Reset input */
var initResetInput = function(input, inputContent) {
  /* TODO */
};

/* Search input */
var initSearchInput = function(input, inputContent) {
  input.placeholder = inputContent.placeholder || null;
  input.pattern = inputContent.pattern || null;
  addSearchTermsAsDatalist(input, inputContent);
};

/* Submit input */
var initSubmitInput = function(input, inputContent) {
  /* TODO */
};

/* Tel input */
var initTelInput = function(input, inputContent) {
  input.placeholder = inputContent.placeholder || null;
};

/* Text input */
var initTextInput = function(input, inputContent) {
  input.value = inputContent.value || null;
  input.placeholder = inputContent.placeholder || null;
};

/* Time input */
var initTimeInput = function(input, inputContent) {
  input.value = inputContent.value;
};

/* Url input */
var initUrlInput = function(input, inputContent) {
  input.placeholder = inputContent.placeholder || null;
  input.pattern = input.pattern || null;
};

var addColorInputsAsDatalist = function(input, inputContent) {
  if (inputContent.colorList !== undefined) {
    var colorList = inputContent.colorList;
    input.datalist = {
      id: (inputContent.id ? inputContent.id : inputContent.name) + "-datalist",
      options: []
    }
    for (var i = 0; i < colorList.length; i++) {
      input.datalist.options[i] = {
        label: colorList[i],
        value: colorList[i]
      }
    }
  }
}

var addSearchTermsAsDatalist = function(input, inputContent) {
  if (inputContent.searchTerms !== undefined) {
    var options = inputContent.searchTerms;
    input.datalist = {
      id: (inputContent.id ? inputContent.id : inputContent.name) + "-datalist",
      options: []
    }
    for (var i = 0; i < options.length; i++) {
      input.datalist.options[i] = {
        label: options[i],
        value: options[i]
      }
    }
  }
}

var getInputType = function (contentType) {
  return contentType.split(":input-")[1] || "text"; // default: text
};

var formatDate = function(date) {
  var dateParts = date.split('-');
  return dateParts[2] + "." + dateParts[1] + "." + dateParts[0];
};

var formatName = function(name) {
  return name.replace(' ', '_').replace('-', '_');
};

var supportsCapture = function(accept) {
  var supportsCapture = false;
  LIST_UTIL.iterateSafely(accept, function(acceptedFormat) {
    if (acceptedFormat === 'image/*' || 
        acceptedFormat === 'video/*' || 
        acceptedFormat === 'audio/*') {
      supportsCapture = true;
      return;
    }
  });
  return supportsCapture;
};

/* Set up input types */