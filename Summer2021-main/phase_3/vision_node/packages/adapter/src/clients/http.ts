import axios, { AxiosRequestConfig } from 'axios';
import { number } from 'yargs';
import { Config, Request } from '../types';
import { property } from 'lodash';
const util = require('util');

function execute(config: AxiosRequestConfig) {

  console.log(config.url, config.method, config.headers, config.data.content, config.params, config.timeout);
  

 
  return axios({
    url: config.url,
    method: config.method,
    headers: config.headers,
    data: JSON.parse(config.data.content),
    params: config.params,
    timeout: config.timeout
  });



  
  

}

export function get(request: Request, config?: Config) {
  return execute({
    ...request,
    url: `${request.baseUrl}${request.path}`,
    method: 'get',
    params: request.data,
    data: undefined,
    timeout: config?.timeout
  });
}

export function post(request: Request, config?: Config) {
   
   
   var link = request.data.link;
   var detection = request.data.detection;
   console.log("detection is",detection);
   console.log("link is", link);
   switch(request.data.raw){
    case "true":
      return execute({
        ...request,
        url: `${request.baseUrl}${request.path}`,
        method: 'post',
        timeout: config?.timeout
      });
    
    default:
      //console.log("not a raw request");
      request.data.content = '{ "requests": [ { "features": [ { "type": "'+detection+'" } ], "image": { "source": { "imageUri": "'+link+'"} } } ] }';
      return execute({
        ...request,
        url: `${request.baseUrl}${request.path}`,
        method: 'post',
        timeout: config?.timeout
      }
      );

  }
}
