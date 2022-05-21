"use strict";
exports.__esModule = true;
exports.floorStringifiedNumber = exports.bigNumberToString = exports.multiplyValue = exports.castValue = void 0;
var isArray = require("lodash/isArray");
var isFinite = require("lodash/isFinite");
var isNil = require("lodash/isNil");
var isPlainObject = require("lodash/isPlainObject");
var bignumber_js_1 = require("bignumber.js");
// Any extra values that do not convert to numbers simply
var SPECIAL_NUMBERS = [
    { value: false, result: 0 },
    { value: 'false', result: 0 },
    { value: true, result: 1 },
    { value: 'true', result: 1 },
];
function castNumber(value, type) {
    var specialNumber = SPECIAL_NUMBERS.find(function (n) { return n.value === value; });
    if (specialNumber) {
        return new bignumber_js_1["default"](specialNumber.result);
    }
    // +value attempts to convert to a number
    if (!isFinite(+value) || value === '' || isNil(value) || isArray(value) || isPlainObject(value)) {
        throw new Error("Unable to convert: '" + JSON.stringify(value) + "' to " + type);
    }
    // We can't use ethers.js BigNumber.from here as it cannot handle decimals
    try {
        return new bignumber_js_1["default"](value);
    }
    catch (e) {
        throw new Error("Unable to convert: '" + JSON.stringify(value) + "' to " + type);
    }
}
function castBoolean(value) {
    switch (value) {
        case 0:
        case '0':
        case false:
        case 'false':
        case undefined:
        case null:
            return false;
        default:
            return true;
    }
}
function castBytes32(value) {
    // Objects convert to "[object Object]" which isn't very useful
    if (isArray(value) || isPlainObject(value)) {
        throw new Error("Unable to convert: '" + JSON.stringify(value) + "' to bytes32");
    }
    return String(value);
}
function castValue(value, type) {
    switch (type) {
        case 'int256':
            return castNumber(value, type);
        case 'bool':
            return castBoolean(value);
        case 'bytes32':
            return castBytes32(value);
    }
}
exports.castValue = castValue;
function multiplyValue(value, times) {
    if (!times) {
        var stringifiedNumber = bigNumberToString(new bignumber_js_1["default"](value));
        return floorStringifiedNumber(stringifiedNumber);
    }
    var bigNumProduct = new bignumber_js_1["default"](value).times(new bignumber_js_1["default"](times));
    var stringProduct = bigNumberToString(bigNumProduct);
    return floorStringifiedNumber(stringProduct);
}
exports.multiplyValue = multiplyValue;
function bigNumberToString(value) {
    // https://blog.enuma.io/update/2019/01/31/safe-use-of-bignumber.js.html
    // .toString(10) removes the exponential notation, if it is present
    return value.toString(10);
}
exports.bigNumberToString = bigNumberToString;
function floorStringifiedNumber(value) {
    // Ethers BigNumber can't handle decimals so we convert to a string and if
    // there are still any remaining decimals, remove them (floor the result)
    return value.split('.')[0];
}
exports.floorStringifiedNumber = floorStringifiedNumber;
