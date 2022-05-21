"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = exports.warn = void 0;
/**
 * Formats string to validator warning
 * @param message - string to include as a warning message
 * @returns formatted validator warning
 */
function warn(message) {
    return { level: 'warning', message: message };
}
exports.warn = warn;
/**
 * Formats string to validator error
 * @param message - string to include as an error message
 * @returns formatted validator error
 */
function error(message) {
    return { level: 'error', message: message };
}
exports.error = error;
//# sourceMappingURL=logger.js.map