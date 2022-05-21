"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
exports.__esModule = true;
exports.buildHeader = void 0;
var isEmpty = require("lodash/isEmpty");
function buildHeader(cookies) {
    if (isEmpty(cookies)) {
        return {};
    }
    var keys = Object.keys(cookies);
    var cookieValues = keys.reduce(function (values, key) {
        var value = encodeURIComponent(cookies[key]);
        var cookie = key + "=" + value + ";";
        return __spreadArray(__spreadArray([], values), [cookie]);
    }, []);
    return { Cookie: cookieValues.join(' ') };
}
exports.buildHeader = buildHeader;
