import { Endpoint } from '@airnode/ois';
import * as adapter from '../src';
import { Method, EndpointParameter, OperationParameter, ParameterTarget, ReservedParameter, ReservedParameterName, EndpointOperation, FixedParameter } from '@airnode/ois';
import { ReservedParameters, ResponseType } from './types';


//const q1:ParameterTarget = 'query';
//const op1:OperationParameter={
//  in:q1,
//  name:"/api/ethgasAPI.json"
//}



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
  name:"data"
}
/*
const epp1: EndpointParameter = {
  name:"link",
  operationParameter:op1,
  default:"https://www.opentext.com/file_source/OpenText/en_US/PNG/OT_ShareImage_twitter.png"
}

const epp2: EndpointParameter = {
  name:"detection",
  operationParameter:op2,
  default:"TEXT_DETECTION"

}

const epp3: EndpointParameter = {
  name:"raw",
  operationParameter:op3,
  default:"false"
}

const epp4: EndpointParameter = {
  name:"data",
  operationParameter:op4,
  default:""
}

*/
const rp1:ReservedParameter = {
  name:ReservedParameterName.Type,
  fixed:'bytes32'
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
    {
      operationParameter:op1,
      value:"https://www.opentext.com/file_source/OpenText/en_US/PNG/OT_ShareImage_twitter.png"
    },
    {
      operationParameter:op2,
      value:"TEXT_DETECTION"
    },
    {
      operationParameter:op3,
      value:"false"
    },
    {
      operationParameter:op4,
      value:""
    }
      
  ],
  parameters:[
 

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
              op4         
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
  parameters: { },
  securitySchemes: [
    
  ]
};



//console.log("request is", request);
async function main() {
  const request = await adapter.buildRequest(options);
    const response = await adapter.executeRequest(request);
    console.log(response.data);
    const parameters = {
      _path: 'responses.0.textAnnotations.0.description',
      _type: rt,
    };
    const result = await adapter.extractAndEncodeResponse(response.data, parameters);


};
main();

