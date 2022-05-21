"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var adapter = require("../src");
var ois_1 = require("@airnode/ois");
var pt1 = "query";
var pt2 = "header";
var rt = 'bytes32';
var op1 = {
    "in": pt1,
    name: "link"
};
var op2 = {
    "in": pt1,
    name: "detection"
};
var op3 = {
    "in": pt1,
    name: "raw"
};
var op4 = {
    "in": pt1,
    name: "content"
};
var op5 = {
    "in": pt1,
    name: "multiple"
};
var op6 = {
    "in": pt1,
    name: "count"
};
var epp1 = {
    name: "link",
    operationParameter: op1
};
var epp2 = {
    name: "detection",
    operationParameter: op2
};
var epp3 = {
    name: "raw",
    operationParameter: op3
};
var epp4 = {
    name: "data",
    operationParameter: op4
};
var epp5 = {
    name: "multiple",
    operationParameter: op5
};
var epp6 = {
    name: "count",
    operationParameter: op6
};
var rp1 = {
    name: ois_1.ReservedParameterName.Type,
    fixed: 'bytes32'
};
var rp2 = {
    name: ois_1.ReservedParameterName.Path,
    fixed: 'responses.0.labelAnnotations.0.description'
};
var eop1 = {
    method: "post",
    path: "/images:annotate?key=AIzaSyAunfU3_nmsrph6Ont8pNr3qW9sZkcSqMo"
};
var ep1 = {
    name: "visionData",
    operation: eop1,
    reservedParameters: [
        rp1
    ],
    fixedOperationParameters: [],
    parameters: [
        epp1,
        epp2,
        epp3,
        epp4,
        epp5,
        epp6
    ]
};
var options = {
    ois: {
        oisFormat: "1.0.0",
        title: "visionExample",
        version: "1.0.0",
        apiSpecifications: {
            servers: [
                {
                    url: "https://vision.googleapis.com/v1"
                }
            ],
            paths: {
                "/images:annotate?key=AIzaSyAunfU3_nmsrph6Ont8pNr3qW9sZkcSqMo": {
                    "post": {
                        parameters: [
                            op1,
                            op2,
                            op3,
                            op4,
                            op5,
                            op6
                        ]
                    }
                }
            },
            components: {
                securitySchemes: {}
            },
            security: {}
        },
        endpoints: [
            ep1
        ]
    },
    endpointName: 'visionData',
    parameters: { link: 'https://hdwallsource.com/img/2014/5/images-26820-27536-hd-wallpapers.jpg', detection: 'LABEL_DETECTION', raw: 'false', content: '', multiple: 'yes', count: '19' },
    securitySchemes: []
};
//console.log("request is", request);
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var request, response, parameters;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, adapter.buildRequest(options)];
                case 1:
                    request = _a.sent();
                    return [4 /*yield*/, adapter.executeRequest(request)];
                case 2:
                    response = _a.sent();
                    console.log(response.data);
                    parameters = {
                        _path: 'responses.0.labelAnnotations.0.description',
                        _type: rt
                    };
                    return [2 /*return*/];
            }
        });
    });
}
;
main();
