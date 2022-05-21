"use strict";
exports.__esModule = true;
exports.encodeValue = exports.convertBoolToBytes32 = exports.convertStringToBytes32 = exports.convertNumberToBytes32 = void 0;
var ethers_1 = require("ethers");
function convertNumberToBytes32(value) {
    var bigNumber = ethers_1.ethers.BigNumber.from(value);
    // Ethers doesn't keep the number in two's complement form but we need this to
    // be able to handle negative integers
    var twosComplementBigNumber = bigNumber.toTwos(256);
    var numberInHexStringForm = twosComplementBigNumber.toHexString();
    // We only need to do this if value is positive but it makes no change if value is negative
    // because calling .toTwos() on a negative number pads it
    var paddedNumberInHexStringForm = ethers_1.ethers.utils.hexZeroPad(numberInHexStringForm, 32);
    return paddedNumberInHexStringForm;
}
exports.convertNumberToBytes32 = convertNumberToBytes32;
function convertStringToBytes32(value) {
    // We can't encode strings longer than 31 characters to bytes32.
    // Ethers need to keep room for null termination
    if (value.length > 31) {
        value = value.substring(0, 31);
    }
    return ethers_1.ethers.utils.formatBytes32String(value);
}
exports.convertStringToBytes32 = convertStringToBytes32;
function convertBoolToBytes32(value) {
    var bytesRepresentation = ethers_1.ethers.utils.hexValue(value ? 1 : 0);
    var paddedBytesRepresentation = ethers_1.ethers.utils.hexZeroPad(bytesRepresentation, 32);
    return paddedBytesRepresentation;
}
exports.convertBoolToBytes32 = convertBoolToBytes32;
function encodeValue(value, type) {
    switch (type) {
        case 'int256':
            return convertNumberToBytes32(value);
        case 'bool':
            return convertBoolToBytes32(value);
        case 'bytes32':
            return convertStringToBytes32(value);
    }
}
exports.encodeValue = encodeValue;
