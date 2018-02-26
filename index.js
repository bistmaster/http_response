/**
 * A simple lib to remove the boiler plate of Cors and application/json, etc.
 */
function response(code, data) {
  return {
    statusCode: code,
    body: JSON.stringify(data),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    }
  }
}
module.exports.response = response;

/**
 * These are helper functions for returning a response through AWS Lambda to the API Gateway
 */
exports.resolve = function(statusCode, callback) {
  var statCode = statusCode || 200;
  return function(data) {
    callback(null, response(statCode , data));
  }
};

/**
 * Generic Reject Handler
 * Handles well formed promise rejections
 */
exports.reject = function (statusCode, callback) {
  var statCode = statusCode || 409;
  return function(err) {
    if (typeof(err) === 'string') {
      err = {errorMessage: err}
    } else if (err) {
      err = {
        errorMessage: err.message,
        arguments: err.arguments,
        type: err.type,
        name: err.name
      }
    }

    callback(null, response(statCode, err));
  }
};

/**
 * Custom error promise error
 * Defaults to 401 Unauthorized
 * Takes a custom message to present to the user
 */
exports.error = function (message, statusCode, callback) {
  var statCode = statusCode || 401;
  return callback(null, response(statCode, {
    message: message
  }));
}