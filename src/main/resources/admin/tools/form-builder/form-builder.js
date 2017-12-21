var portalLib = require('/lib/xp/portal');
var thymeleaf = require('/lib/xp/thymeleaf');

var timestamp = Date.now();

function handleGet() {

  var view = resolve('./form-builder.html');

  var model = {
    formBuilderAdmin: {
      // cssUrl: portalLib.assetUrl({ path: "/form-builder-admin/css/form-builder-admin.css" }),
      jsUrl: portalLib.assetUrl({ path: "/form-builder-admin/js/bundle.js" }),
      favicon: portalLib.assetUrl({ path: "/form-builder-admin/icons/form-builder.png" })
    },
    appLauncherConfig: {
      adminUrl: "" + portalLib.url({path: "/admin"}),
      assetsUri: "" + portalLib.url({path: "/admin/assets/" + timestamp}),
      appId: "xp-form-builder",
      appName: "Form builder"
    }
  };

  return {
    contentType: 'text/html',
    body: thymeleaf.render(view, model)
  };
}

exports.get = handleGet;