exports.asList = function(listOrObject) {
  return asList(listOrObject);
};

exports.iterateSafely = function(listOrObject, handler) {
  iterateSafely(listOrObject, handler);
};

var asList = function(listOrObject) {
  if (Object.prototype.toString.call(listOrObject) === '[object Array]') {
    return listOrObject;
  } else if (listOrObject !== undefined) {
    return [listOrObject];
  } else {
    return [];
  }
};

var iterateSafely = function(listOrObject, handler) {
  var list = exports.asList(listOrObject);
  for (var i = 0; i < list.length; i++) {
    handler(list[i]);
  }
};