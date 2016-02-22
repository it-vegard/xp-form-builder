var portal = require('/lib/xp/portal'); // Import the portal functions
var thymeleaf = require('/lib/xp/thymeleaf'); // Import the Thymeleaf rendering function
var contentLib = require('/lib/xp/content'); // Import the content library
var auth = require('/lib/xp/auth'); // Import the content library

var moment = require('/lib/moment.min.js'); // Import Moment.js

var FORM_BUILDER = require('/lib/form-builder/formbuilder-util');

var styleConfig = {
    bootstrap: {
        styleTag: "<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css'/>",
        view: "/views/bootstrap/form.html"
    },
    "xp-formbuilder": {
        styleTag: "<link rel='stylesheet' href='css/xp-formbuilder.css'/>",
        view: "/views/xp-formbuilder/form.html"
    },
    default: {
        styleTag: "",
        view: "/views/default/form.html"
    }
};

// Handle the GET request
exports.get = function(req) {

    // Get the content data
    var content = portal.getContent();
    var contentData = content.data;

    // Set up the form structure
    var form = FORM_BUILDER.initForm(contentData);

    // Prepare the model object with the needed data extracted from the content
    var model = {
        name: content.displayName,
        form: form
    };

    // Specify the view file to use
    var view = resolve(styleConfig[contentData.style].view);

    // Get client-side JavaScript for the formbuilder
    var formScript = portal.assetUrl({
        path: 'js/formbuilder.js'
    });

    // Return the merged view and model in the response object
    return {
        body: thymeleaf.render(view, model),
        pageContributions: {
            headBegin: styleConfig[contentData.style].styleTag,
            headEnd: "<script type='text/javascript' src='" + formScript + "'></script>"
        }
    };
};

exports.post = function(req) {
    var submittedForm = req.params;
    log.info("Received the following form: %s ", submittedForm);
    log.info("Not handling the submitted form any further. Please add a service and link to that with the action URL in the form in order to handle the form.");
    
    var component = portal.getComponent();
    var formConfig = component["config"];
    
    if (formConfig.responseFolder) {
        var content = contentLib.get({key: formConfig.responseFolder});
        if (content) {
            var parentPath = content._path;
            var timestamp = moment().format('YYYY-MM-DDTHH:mm:ss.SSS');
            var name = timestamp + "-" + auth.getUser().login;
            var displayName = timestamp + ": " + auth.getUser().login;
            submittedForm.displayName = displayName;
            var response = contentLib.create({
                name: name,
                parentPath: parentPath,
                displayName: displayName,
                requireValid: true,
                contentType: 'base:unstructured',
                branch: 'draft',
                language: 'no',
                data: submittedForm
            });
            return {
                body: response
            };
        }
    }

    return {
        body: {
            parentPath: parentPath,
            formResponse: submittedForm,
            formConfig: formConfig,
            component: component
        }
    };
};