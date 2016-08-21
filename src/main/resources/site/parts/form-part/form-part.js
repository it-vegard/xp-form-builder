var portal = require('/lib/xp/portal'); // Import the portal functions
var thymeleaf = require('/lib/xp/thymeleaf'); // Import the Thymeleaf rendering function
var contentLib = require('/lib/xp/content'); // Import the content library

var moment = require('/lib/moment.min.js'); // Import Moment.js

var FORM_BUILDER = require('/lib/form-builder/formbuilder-util');

var styleConfig = {
    bootstrap: {
        css: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css",
        view: "/views/bootstrap/form.html"
    },
    "xp-formbuilder": {
        css: "css/formbuilder.css",
        view: "/views/xp-formbuilder/form.html"
    },
    default: {
        css: "",
        view: "/views/default/form.html"
    }
};

var createCssUrl = function(style) { 
    var pathOrUrl = styleConfig[style].css;
    if (pathOrUrl === undefined || pathOrUrl === null || pathOrUrl === "") {
        return "";
    } else if (pathOrUrl.contains("://")) {
        return pathOrUrl; // Absolute URL. Doesn't need handling.
    } else {
        return portal.assetUrl({path: styleConfig[style].css});
    }
};

var getFormContent = function() {
    var component = portal.getComponent();
    var componentConfig = component["config"];
    return componentConfig.form ? contentLib.get({key: componentConfig.form}) : portal.getContent();
};

// Handle the GET request
exports.get = function(req) {
    // Get site config
    var siteConfig = portal.getSiteConfig();

    // Get the component data to check if a form has been added to the part.
    // This enables the use of this part in other templates than the form template, as well as fragments
    var content = getFormContent();
    content.data.id = content._name;
    var contentData = content.data;

    // Set up the form structure
    var form = FORM_BUILDER.initForm(contentData);

    // Prepare the model object with the needed data extracted from the content
    var model = {
        name: content.displayName,
        form: form
    };

    // Specify the view file to use. Use form config as primary option, site config as secondary option and "default" as fallback/default.
    var style = contentData.style || siteConfig["formbuilder-style"] || "default";
    var view = resolve(styleConfig[style].view);

    // Get client-side JavaScript for the formbuilder
    var formScript = portal.assetUrl({
        path: 'js/formbuilder.js'
    });

    // Return the merged view and model in the response object
    return {
        body: thymeleaf.render(view, model),
        pageContributions: {
            headBegin: styleConfig[style].css ? "<link rel='stylesheet' href='" + createCssUrl(style) + "'/>" : "",
            headEnd: "<script type='text/javascript' src='" + formScript + "'></script>"
        }
    };
};

exports.post = function(req) {
    var formConfig = getFormContent().data;
    return FORM_BUILDER.receiveForm(req, formConfig);
};