"use strict";
exports.__esModule = true;
exports.buildAndExecuteRequest = exports.executeRequest = void 0;
var build_request_1 = require("./build-request");
var http = require("../clients/http");
function executeRequest(request, config) {
    switch (request.method) {
        case 'get':
            return http.get(request, config);
        case 'post':
            return http.post(request, config);
    }
}
exports.executeRequest = executeRequest;
function buildAndExecuteRequest(options, config) {
    var request = build_request_1.buildRequest(options);
    return executeRequest(request, config);
}
exports.buildAndExecuteRequest = buildAndExecuteRequest;
