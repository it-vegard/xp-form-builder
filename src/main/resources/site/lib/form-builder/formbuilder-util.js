var portal = require('/lib/xp/portal'); // Import the portal functions
var contentLib = require('/lib/xp/content'); // Import the portal functions
var auth = require('/lib/xp/auth'); // Import the content library

var LIST_UTIL = require('/lib/form-builder/list-util');
var moment = require('/lib/moment.min.js'); // Import Moment.js

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

exports.receiveForm = function(request, formConfig) {
  var form = request.params;
  form.displayName = formConfig.title || "form-response";
  var attachments = [];
  var multiPartForm = portal.getMultipartForm();
  if (multiPartForm) {
    attachments = saveAttachments(multiPartForm, formConfig);
    for (var i = 0; i < attachments.length; i++) {
      var attachment = attachments[i];
      if (!form[attachment.inputId]) form[attachment.inputId] = { attachments: [] }; 
      form[attachment.inputId].attachments.push({
        id: attachment.id,
        name: attachment.name
      });
    }
  }
  var response = saveForm(form, formConfig);
  return {
    body: formConfig.response
  };
};

var saveForm = function(form, formConfig) {
  var responseFolder = getResponseFolder(formConfig);
  var timestamp = moment().format('YYYY-MM-DDTHH:mm:ss');
  var name = timestamp + "-" + auth.getUser().login;
  var displayName = timestamp + ": " + auth.getUser().login;
  var response = contentLib.create({
      name: name,
      parentPath: responseFolder,
      displayName: form.displayName,
      requireValid: true,
      contentType: 'base:unstructured',
      branch: 'draft',
      data: form
  });
  log.info("Stored form response. Response key: %s", response._id);
  return {
      body: response
  };
};

var saveAttachments = function(form, formConfig) {
  var responseFolder = getResponseFolder(formConfig);
  var attachmentsFolder = getAttachmentFolderOrCreateNew(responseFolder);
  var files = getFilesFromForm(form);
  var savedFiles = [];
  for (var index = 0; index < files.length; index++) {
    var savedFile = saveFile(files[index], attachmentsFolder);
    savedFiles.push(savedFile);
  }
  return savedFiles;
};

var getAttachmentFolderOrCreateNew = function(parentFolder) {
  try {
    var attachmentsFolder = contentLib.create({
      name: '_attachments',
      parentPath: parentFolder,
      displayName: '_attachments',
      draft: true,
      contentType: 'base:folder',
      data: {}
    });
    return attachmentsFolder._path;
  } catch (exception) {
    if (exception.code === 'contentAlreadyExists') {
      return parentFolder + "/_attachments";
    }  else {
      log.info("Unexpected error when creating attachments-folder in path '%s': %s", parentFolder, exception);
      return parentFolder;
    }
  }
};

var getFilesFromForm = function(form) {
  var files = [];
  for (var inputName in form) {
    var input = form[inputName];
    if (inputIsFile(input)) {
      files.push(input);
    }
  }
  return files;
};

var inputIsFile = function(input) {
  return (input["fileName"] !== undefined && input["contentType"] !== undefined);
};

var saveFile = function(file, folder) {
  var stream = portal.getMultipartStream(file.name);
  var result = contentLib.createMedia({
    name: file.fileName,
    parentPath: folder,
    mimeType: file.contentType,
    data: stream
  });
  return {
    id: result._id,
    inputId: file.name.split("[")[0],
    name: result._name,
    displayName: result.displayName,
    type: result.type
  };
};

var getResponseFolder = function(formConfig) {
  try {
    var responseFolderKey = formConfig["responseFolder"];
    var responseFolder = contentLib.get({key: responseFolderKey});
    return responseFolder._path;
  } catch (exception) {
    log.error("Could not resolve folder to store form responses in.", exception);
  }
};

var addCommonInputValues = function(input, inputContent) {
  input.id = inputContent.id || inputContent.name;
  input.name = inputContent.name; // required
  input.label = inputContent.label; // required
  input.title = inputContent.title;
  input.help = inputContent.help;
  input.class = inputContent.class;
  input.required = inputContent.required || false;
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
  } else if (inputContent.min && inputContent.max && inputContent.step) { // Fall back to generate datalist based on max, min and step
    input.datalist = {
      id: input.id + "-datalist",
      options: []
    };
    for (var i = inputContent.min; i <= inputContent.max; i = i + inputContent.step) {
      input.datalist.options.push({
        label: i,
        value: i
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
  addDatalist(input, inputContent);
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
    for (var i = 0; i < colorList.hexValues.length; i++) {
      input.datalist.options[i] = {
        label: colorList.hexValues[i],
        value: colorList.hexValues[i]
      }
    }
  }
}

var addDatalist = function(input, inputContent) {
  if (inputContent.datalist !== undefined) {
    var options = inputContent.datalist.datalistOptions;
    input.datalist = {
      id: (inputContent.id ? inputContent.id : inputContent.name) + "-datalist",
      options: []
    }
    for (var i = 0; i < options.length; i++) {
      input.datalist.options[i] = {
        label: options[i].optionLabel,
        value: options[i].optionValue
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