var portal = require('/lib/xp/portal'); // Import the portal functions
var thymeleaf = require('/lib/xp/thymeleaf'); // Import the Thymeleaf rendering function
var contentLib = require('/lib/xp/content'); // Import the content library

var FORM_BUILDER = require('/lib/form-builder/formbuilder-util');

var styleConfig = {
    bootstrap: {
        css: "https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css",
        view: "/views/bootstrap/form.html"
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

// Handle the GET request
exports.get = function(req) {

    // Get the component data
    var component = portal.getComponent();
    var formConfig = component["config"];

    // Set up the form structure
    var form = FORM_BUILDER.initForm(formConfig);

    // Prepare the model object with the needed data extracted from the content
    var model = {
        name: component.displayName,
        form: form
    };

    // Specify the view file to use
    var view = resolve(styleConfig[formConfig.style].view);

    // Get client-side JavaScript for the formbuilder
    var formScript = portal.assetUrl({
        path: 'js/formbuilder.js'
    });

    // Return the merged view and model in the response object
    return {
        body: thymeleaf.render(view, model),
        pageContributions: {
            headBegin: styleConfig[formConfig.style].css ? "<link rel='stylesheet' href='" + createCssUrl(formConfig.style) + "'/>" : "",
            headEnd: "<script type='text/javascript' src='" + formScript + "'></script>"
        }
};
            };

exports.post = function(req) {
    return FORM_BUILDER.receiveForm(req);
};