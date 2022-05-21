import { Endpoint } from '@airnode/ois';
import * as adapter from '../src';
import { Method, EndpointParameter, OperationParameter, ParameterTarget, ReservedParameter, ReservedParameterName, EndpointOperation, FixedParameter } from '@airnode/ois';
import { ReservedParameters, ResponseType } from './types';



const pt1:ParameterTarget="query";
const pt2:ParameterTarget="header";

const rt: ResponseType = 'bytes32';


const op1:OperationParameter={
  in:pt1,
  name:"link"
}

const op2:OperationParameter={
  in:pt1,
  name:"detection"
}
const op3:OperationParameter={
  in:pt1,
  name:"raw"
}

const op4:OperationParameter={
  in:pt1,
  name:"content"
}

const op5:OperationParameter={
  in:pt1,
  name:"multiple"
}

const op6:OperationParameter={
  in:pt1,
  name:"count"
}

const epp1: EndpointParameter = {
  name:"link",
  operationParameter:op1,
  //default:"https://www.opentext.com/file_source/OpenText/en_US/PNG/OT_ShareImage_twitter.png"
}

const epp2: EndpointParameter = {
  name:"detection",
  operationParameter:op2,
  //default:"TEXT_DETECTION"

}

const epp3: EndpointParameter = {
  name:"raw",
  operationParameter:op3,
  //default:"false"
}

const epp4: EndpointParameter = {
  name:"data",
  operationParameter:op4,
  //default:""
}

const epp5: EndpointParameter = {
  name:"multiple",
  operationParameter:op5,
  //default:""
}

const epp6: EndpointParameter = {
  name:"count",
  operationParameter:op6,
  //default:""
}


const rp1:ReservedParameter = {
  name:ReservedParameterName.Type,
  fixed:'bytes32'
}

const rp2:ReservedParameter = {
  name:ReservedParameterName.Path,
  fixed:'responses.0.labelAnnotations.0.description'
}

const eop1:EndpointOperation = {
  method:"post",
  path:"/images:annotate?key=AIzaSyAunfU3_nmsrph6Ont8pNr3qW9sZkcSqMo"
}



const ep1:Endpoint = {
  name:"visionData",
  operation:eop1,
  reservedParameters:[
    rp1
  ],
  fixedOperationParameters:[

      
  ],
  parameters:[

    epp1,
    epp2,
    epp3,
    epp4,
    epp5,
    epp6
 

  ]
}



const options = {
  ois:  {
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
  } , // a valid OIS object
  endpointName: 'visionData',
  parameters: { link: 'https://hdwallsource.com/img/2014/5/images-26820-27536-hd-wallpapers.jpg', detection: 'LABEL_DETECTION',raw:'false',content:'',multiple:'yes',count:'19'},
  securitySchemes: [
    
  ]
};



//console.log("request is", request);
async function main() {
  const request = await adapter.buildRequest(options);
    const response = await adapter.executeRequest(request);
    console.log(response.data);
    /*
    const parameters = {
      _path: 'description',
      _type: rt,
      _multiple: "true" 
    };
    */
     const parameters = {
          _path: 'responses.0.labelAnnotations.0.description',
          _type: rt
        };
    //const result = await adapter.extractAndEncodeResponse(response.data, parameters);


};
main();
