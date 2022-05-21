import { Log } from '../types';
/**
 * Formats string to validator warning
 * @param message - string to include as a warning message
 * @returns formatted validator warning
 */
export declare function warn(message: string): Log;
/**
 * Formats string to validator error
 * @param message - string to include as an error message
 * @returns formatted validator error
 */
export declare function error(message: string): Log;
