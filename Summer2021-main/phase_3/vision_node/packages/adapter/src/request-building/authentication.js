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
var isEmpty = require("lodash/isEmpty");
function addApiKeyAuth(authentication, apiSecurityScheme, value) {
    var _a, _b, _c;
    var name = apiSecurityScheme.name;
    if (!name) {
        return authentication;
    }
    switch (apiSecurityScheme["in"]) {
        case 'query':
            return __assign(__assign({}, authentication), { query: __assign(__assign({}, authentication.query), (_a = {}, _a[name] = value, _a)) });
        case 'header':
            return __assign(__assign({}, authentication), { headers: __assign(__assign({}, authentication.headers), (_b = {}, _b[name] = value, _b)) });
        case 'cookie':
            return __assign(__assign({}, authentication), { cookies: __assign(__assign({}, authentication.cookies), (_c = {}, _c[name] = value, _c)) });
        default:
            return authentication;
    }
}
function addHttpAuth(authentication, apiSecurityScheme, value) {
    switch (apiSecurityScheme.scheme) {
        // The value for basic auth should be the base64 encoded value from
        // <username>:<password>
        case 'basic':
            return __assign(__assign({}, authentication), { headers: { Authorization: "Basic " + value } });
        // The value for bearer should be the encoded token
        case 'bearer':
            return __assign(__assign({}, authentication), { headers: { Authorization: "Bearer " + value } });
        default:
            return authentication;
    }
}
function addSchemeAuthentication(authentication, apiSecurityScheme, value) {
    if (apiSecurityScheme.type === 'apiKey') {
        return addApiKeyAuth(authentication, apiSecurityScheme, value);
    }
    if (apiSecurityScheme.type === 'http') {
        return addHttpAuth(authentication, apiSecurityScheme, value);
    }
    return authentication;
}
function buildParameters(options) {
    var initialParameters = {
        query: {},
        headers: {},
        cookies: {}
    };
    var securitySchemeSecrets = options.securitySchemeSecrets;
    // Security schemes originate from 'security.json' and contain all of the authentication details
    if (!securitySchemeSecrets || isEmpty(securitySchemeSecrets)) {
        return initialParameters;
    }
    // API security schemes originate from 'config.json' and specify which schemes should be used
    var apiSecuritySchemes = options.ois.apiSpecifications.components.securitySchemes;
    if (isEmpty(apiSecuritySchemes)) {
        return initialParameters;
    }
    var apiSecuritySchemeNames = Object.keys(apiSecuritySchemes);
    return apiSecuritySchemeNames.reduce(function (authentication, apiSecuritySchemeName) {
        var apiSecurityScheme = apiSecuritySchemes[apiSecuritySchemeName];
        // If there are no credentials in `security.json`, ignore the scheme
        var securitySchemeSecret = securitySchemeSecrets.find(function (_a) {
            var securitySchemeName = _a.securitySchemeName;
            return securitySchemeName === apiSecuritySchemeName;
        });
        if (!securitySchemeSecret) {
            return authentication;
        }
        return addSchemeAuthentication(authentication, apiSecurityScheme, securitySchemeSecret.value);
    }, initialParameters);
}
exports.buildParameters = buildParameters;
