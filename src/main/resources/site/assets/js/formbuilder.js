'use strict';

var XP_LIST_UTIL = {
  asList:  function(listOrObject) {
    if (Object.prototype.toString.call(listOrObject) === '[object Array]') {
      console.log("Is an array");
      return listOrObject;
    } else if (listOrObject !== undefined) {
      console.log("Is an object");
      return [listOrObject];
    } else {
      console.log("Is undefined");
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
    /*form.addEventListener('submit', function(e){
      var urlInputs = form.getElementsByClass("xp-form-url");
      for (var i = 0; i < urlInputs.length; i++) {
        if (urlInputs[i].value.substr(0, 2) !== '//') {
          urlInputs[i].value = 'http:' + urlInputs[i]
        } else if (urlInputs[i].value.substr(0, 7) !== 'http://' && urlInputs[i].value.substr(0, 8) !== 'https://') {
          urlInputs[i].value = 'http://' + urlInputs[i]
        }
      };
    });*/
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
