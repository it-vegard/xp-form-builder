var repoLib = require('/lib/xp/repo');
var nodeLib = require('/lib/xp/node');
var contextLib = require('/lib/xp/context');

var FORM_REPO_ID = 'xp-forms';
var FIRST_FORM_ID = 'my-first-form';

// Log application started
log.info('Application ' + app.name + ' started');

function initialize() {
  initializeFormsRepo();
}

function initializeFormsRepo() {
  if (!repoLib.get(FORM_REPO_ID)) {
    repoLib.create({
      id: FORM_REPO_ID,
      rootChildOrder: '_timestamp DESC'
    });
  } else {
    repoLib.delete(FIRST_FORM_ID);
  }
}

function setupInitialForm() {
  var formJsonSchema = {
    id: FIRST_FORM_ID,
    schema: {
      $schema: "http://json-schema.org/draft-04/schema#",
      title: "My first form",
      description: "A user-generated form for Enonic XP",
      type: "array",
      items: {
        anyOf: [
          {
            title: "Name",
            type: "object",
            properties: {
              inputType: {
                type: "text"
              },
              placeholder: {
                type: "text"
              }
            }
          }
        ]
      },
      required: ["id", "name", "price"]
    }
  };
}

var repos = contextLib.run({
  repository: 'system-repo',
  branch: 'master',
  user: {
    login: 'su',
    userStore: 'system'
  },
  principals: ["role:system.admin"],
  attributes: {
    'ignorePublishTimes': true
  }
}, initialize);