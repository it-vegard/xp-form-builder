var portal = require('/lib/xp/portal'); // Import the portal functions
var contentLib = require('/lib/xp/content'); // Import the portal functions

var moment = require('/lib/moment.min.js'); // Import Moment.js

exports.save = function(request, formConfig) {
  var formData = request.params;
  formData.displayName = formConfig.title || "form-response";
  var responseFolder = getResponseFolder(formConfig);
  return receiveForm(formData, formConfig, responseFolder);
};

/*** Private functions for the inner workings of the class ***/

var receiveForm = function(formData, formConfig, responseFolder) {
  var attachments = [];
  var multiPartForm = portal.getMultipartForm();
  if (multiPartForm) {
    attachments = saveAttachments(multiPartForm, responseFolder);
    for (var i = 0; i < attachments.length; i++) {
      var attachment = attachments[i];
      if (!formData[attachment.inputId]) formData[attachment.inputId] = { attachments: [] }; 
      formData[attachment.inputId].attachments.push({
        id: attachment.id,
        name: attachment.name,
        url: portal.attachmentUrl({ id: attachment.id, download: true }) || ""
      });
    }
  }
  var response = saveForm(formData, responseFolder);
  return formConfig.response;
};

var saveForm = function(form, responseFolder) {
  var timestamp = moment().format('YYYY-MM-DDTHH:mm:ss');
  var base64encodedForm = new Buffer(form).toString('base64');
  var name = "".concat("[", timestamp, "] ", base64encodedForm);
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

var saveAttachments = function(form, responseFolder) {
  var attachmentsFolder = getAttachmentFolderOrCreateNew(responseFolder);
  var files = getFilesFromForm(form);
  var savedFiles = [];
  for (var index = 0; index < files.length; index++) {
    var savedFile = saveFile(files[index], attachmentsFolder);
    savedFiles.push(savedFile);
  }
  return savedFiles;
};

var getResponseFolder = function(formConfig) {
  try {
    return formConfig["responseFolder"] ? 
      contentLib.get({key: formConfig["responseFolder"]})._path : 
      portal.getContent()._path;
  } catch (exception) {
    log.error("Could not resolve folder to store form responses in.", exception);
  }
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
