"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
exports.__esModule = true;
exports.multiplyValue = exports.extractAndEncodeResponse = exports.extractValue = exports.encodeValue = exports.buildAndExecuteRequest = exports.executeRequest = exports.buildRequest = void 0;
var request_building_1 = require("./request-building");
__createBinding(exports, request_building_1, "buildRequest");
__createBinding(exports, request_building_1, "executeRequest");
__createBinding(exports, request_building_1, "buildAndExecuteRequest");
var response_processing_1 = require("./response-processing");
__createBinding(exports, response_processing_1, "encodeValue");
__createBinding(exports, response_processing_1, "extractValue");
__createBinding(exports, response_processing_1, "extractAndEncodeResponse");
__createBinding(exports, response_processing_1, "multiplyValue");
__exportStar(require("./types"), exports);
