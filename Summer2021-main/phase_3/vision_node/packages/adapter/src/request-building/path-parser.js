"use strict";
exports.__esModule = true;
exports.parsePathWithParameters = void 0;
var trimEnd = require("lodash/trimEnd");
var trimStart = require("lodash/trimStart");
var isEmpty = require("lodash/isEmpty");
function removeBraces(value) {
    return trimEnd(trimStart(value, '{'), '}');
}
function parsePathWithParameters(rawPath, parameters) {
    // Match on anything in the path that is braces
    // i.e. The path /users/{id}/{action} will match ['{id}', '{action}']
    var regex = /\{([^}]+)\}/g;
    var matches = rawPath.match(regex);
    // The path contains no braces so no action required
    if (!matches || isEmpty(matches)) {
        return rawPath;
    }
    var path = matches.reduce(function (updatedPath, match) {
        var withoutBraces = removeBraces(match);
        var value = parameters[withoutBraces];
        if (value) {
            return updatedPath.replace(match, value);
        }
        return updatedPath;
    }, rawPath);
    // Check that all path parameters have been replaced
    var matchesPostParse = path.match(regex);
    if (matchesPostParse && !isEmpty(matchesPostParse)) {
        var missingParams = matchesPostParse.map(function (m) { return "'" + removeBraces(m) + "'"; }).join(', ');
        throw new Error("The following path parameters were expected but not provided: " + missingParams);
    }
    return path;
}
exports.parsePathWithParameters = parsePathWithParameters;
