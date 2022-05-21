"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.buildParameters = void 0;
var authentication = require("./authentication");
var cookies = require("./cookies");
function initalParameters() {
    return {
        paths: {},
        query: {},
        headers: {},
        cookies: {}
    };
}
function appendParameter(parameters, target, name, value) {
    var _a, _b, _c, _d;
    switch (target) {
        case 'path':
            return __assign(__assign({}, parameters), { paths: __assign(__assign({}, parameters.paths), (_a = {}, _a[name] = value, _a)) });
        case 'query':
            return __assign(__assign({}, parameters), { query: __assign(__assign({}, parameters.query), (_b = {}, _b[name] = value, _b)) });
        case 'header':
            return __assign(__assign({}, parameters), { headers: __assign(__assign({}, parameters.headers), (_c = {}, _c[name] = value, _c)) });
        case 'cookie':
            return __assign(__assign({}, parameters), { cookies: __assign(__assign({}, parameters.cookies), (_d = {}, _d[name] = value, _d)) });
        default:
            return parameters;
    }
}
function buildFixedParameters(options) {
    var endpoint = options.endpoint, operation = options.operation;
    return endpoint.fixedOperationParameters.reduce(function (acc, parameter) {
        var _a = parameter.operationParameter, name = _a.name, target = _a["in"];
        // Double check that the parameter exists in the API specification
        var apiParameter = operation.parameters.find(function (ap) { return ap.name === name; });
        if (!apiParameter) {
            return acc;
        }
        return appendParameter(acc, target, name, parameter.value);
    }, initalParameters());
}
function buildUserParameters(options) {
    var endpoint = options.endpoint, operation = options.operation;
    var parameterKeys = Object.keys(options.parameters);
    return parameterKeys.reduce(function (acc, key) {
        var parameter = endpoint.parameters.find(function (p) { return p.name === key; });
        // If the parameter is not defined in the Endpoint specification, ignore it.
        if (!parameter) {
            return acc;
        }
        // Double check that the parameter exists in the API specification
        var apiParameter = operation.parameters.find(function (p) { return p.name === parameter.operationParameter.name; });
        if (!apiParameter) {
            return acc;
        }
        var _a = parameter.operationParameter, name = _a.name, target = _a["in"];
        return appendParameter(acc, target, name, options.parameters[key]);
    }, initalParameters());
}
function buildParameters(options) {
    var auth = authentication.buildParameters(options);
    var fixed = buildFixedParameters(options);
    var user = buildUserParameters(options);
    var cookie = cookies.buildHeader(__assign(__assign(__assign({}, user.cookies), fixed.cookies), auth.cookies));
    // NOTE: User parameters MUST come first otherwise they could potentially
    // overwrite fixed and authentication parameters
    return {
        paths: __assign(__assign({}, user.paths), fixed.paths),
        query: __assign(__assign(__assign({}, user.query), fixed.query), auth.query),
        headers: __assign(__assign(__assign(__assign({}, user.headers), fixed.headers), auth.headers), cookie)
    };
}
exports.buildParameters = buildParameters;
