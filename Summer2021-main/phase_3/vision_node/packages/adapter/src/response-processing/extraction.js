"use strict";
exports.__esModule = true;
exports.extractAndEncodeResponse = exports.extractValue = exports.getRawValue = void 0;
var bignumber_js_1 = require("bignumber.js");
var isUndefined = require("lodash/isUndefined");
var casting = require("./casting");
var encoding = require("./encoding");
//export function getRawValue(data: any, path?: string, defaultValue?: any,multiple?:string,position?:number) {
function getRawValue(data, path, defaultValue) {
    // Some APIs return a simple value not in an object or array, like
    // a string, number or boolean. If this is the case, the user can
    // choose to omit the path which means that the adapter does not
    // need to do any "extraction".
    if (!path) {
        return data;
    }
    // We could use lodash#get, but it's slow and we want to control the
    // exact behaviour ourselves.
    return path.split('.').reduce(function (acc, segment) {
        try {
            var nextValue = acc[segment];
            return nextValue === undefined ? defaultValue : nextValue;
        }
        catch (e) {
            return defaultValue;
        }
    }, data);
}
exports.getRawValue = getRawValue;
//export function extractValue(data: unknown, path?: string, multiple?:string,position?:number) {
function extractValue(data, path) {
    var rawValue;
    //rawValue = getRawValue(data, path,undefined,multiple,position);
    rawValue = getRawValue(data, path);
    if (isUndefined(rawValue)) {
        throw new Error("Unable to find value from path: '" + path + "'");
    }
    return rawValue;
}
exports.extractValue = extractValue;
function extractAndEncodeResponse(data, parameters) {
    //const rawValue = extractValue(data, parameters._path,parameters._multiple,parameters._position);
    var rawValue = extractValue(data, parameters._path);
    var value = casting.castValue(rawValue, parameters._type);
    console.log("casting is", value);
    if (parameters._type === 'int256' && value instanceof bignumber_js_1["default"]) {
        var multipledValue = casting.multiplyValue(value, parameters._times);
        var encodedValue_1 = encoding.encodeValue(multipledValue.toString(), 'int256');
        return { value: multipledValue, encodedValue: encodedValue_1 };
    }
    var encodedValue = encoding.encodeValue(value, parameters._type);
    /*
     let detection = config.data.detection;
     let count = config.data.count;
     let multiple = config.data.multiple;
     let content = config.data.content;
     let responsePoint;
     switch(detection){
       case "TEXT_DETECTION":
         responsePoint = "textAnnotations";
   
       case "LABEL_DETECTION":
         responsePoint = "labelAnnotations";
   
       case "LOGO_DETECTION":
         responsePoint = "logoAnnotations";
       
       default:
         responsePoint = "labelAnnotations";
     }
   
     console.log(result);
   
     
     console.log(util.inspect(result, {showHidden: false, depth: null}));
     
       var fArray:string[]=[];
       switch(multiple){
         case "yes":
           if(count){
             for(let i=0;i<parseInt(config.data?.count);i++){
               try{
                 fArray.push(result.data.responses[0][responsePoint][i].description);
               }
               catch(error){
               }
             }
           }
           console.log("res is",fArray.toString());
           return {"data":fArray.toString()};
     
         default:
           return {value, result.data.responses[0][responsePoint][0].description};
     
       }
       */
    return { value: value, encodedValue: encodedValue };
}
exports.extractAndEncodeResponse = extractAndEncodeResponse;
