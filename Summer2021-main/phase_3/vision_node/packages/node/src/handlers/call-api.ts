import * as adapter from '@airnode/adapter';
import { OIS, SecuritySchemeSecret } from '@airnode/ois';
import { getReservedParameters, RESERVED_PARAMETERS } from '../adapters/http/parameters';
import { getConfigSecret } from '../config';
import { API_CALL_TIMEOUT, API_CALL_TOTAL_TIMEOUT } from '../constants';
import * as logger from '../logger';
import {
  AggregatedApiCall,
  ApiCallParameters,
  ApiCallResponse,
  ChainConfig,
  Config,
  LogsData,
  RequestErrorCode,
} from '../types';
import { removeKeys } from '../utils/object-utils';
import { go, retryOnTimeout } from '../utils/promise-utils';

function addMetadataParameters(
  chain: ChainConfig,
  aggregatedApiCall: AggregatedApiCall,
  reservedParameters: adapter.ReservedParameters
): ApiCallParameters {
  const parameters = aggregatedApiCall.parameters;
  switch (reservedParameters._relay_metadata?.toLowerCase()) {
    case 'v1':
      return {
        ...parameters,
        _airnode_provider_id: aggregatedApiCall.providerId,
        _airnode_client_address: aggregatedApiCall.clientAddress,
        _airnode_designated_wallet: aggregatedApiCall.designatedWallet,
        _airnode_endpoint_id: aggregatedApiCall.endpointId,
        _airnode_requester_index: aggregatedApiCall.requesterIndex,
        _airnode_request_id: aggregatedApiCall.id,
        _airnode_chain_id: aggregatedApiCall.chainId,
        _airnode_chain_type: chain.type,
        _airnode_airnode: chain.contracts.Airnode,
      };
    default:
      return parameters;
  }
}

function buildSecuritySchemeSecrets(ois: OIS): SecuritySchemeSecret[] {
  const securitySchemeNames = Object.keys(ois.apiSpecifications.components.securitySchemes);
  const securitySchemeSecrets = securitySchemeNames.map((securitySchemeName) => {
    const value = getConfigSecret(ois.title, securitySchemeName) || '';
    return { securitySchemeName, value } as SecuritySchemeSecret;
  });
  return securitySchemeSecrets;
}

function buildOptions(
  chain: ChainConfig,
  ois: OIS,
  aggregatedApiCall: AggregatedApiCall,
  reservedParameters: adapter.ReservedParameters
): adapter.BuildRequestOptions {
  // Include airnode metadata based on _relay_metadata version number
  const parametersWithMetadata = addMetadataParameters(chain, aggregatedApiCall, reservedParameters);

  //console.log("meta data",parametersWithMetadata);
  console.log("aggregated",aggregatedApiCall);

  // Don't submit the reserved parameters to the API
  const sanitizedParameters = removeKeys(parametersWithMetadata || {}, RESERVED_PARAMETERS);

  console.log("santized link", sanitizedParameters);
  console.log("santized link", sanitizedParameters.link);

  // Fetch secrets and build a list of security schemes
  const securitySchemeSecrets = buildSecuritySchemeSecrets(ois);

  return {
    endpointName: aggregatedApiCall.endpointName!,
    parameters: sanitizedParameters,
    ois,
    securitySchemeSecrets,
  };
}

export async function callApi(
  config: Config,
  aggregatedApiCall: AggregatedApiCall
): Promise<LogsData<ApiCallResponse>> {
  const { chainId, endpointName, oisTitle } = aggregatedApiCall;
  const chain = config.nodeSettings.chains.find((c) => c.id === Number(chainId))!;
  const ois = config.ois.find((o) => o.title === oisTitle)!;
  const endpoint = ois.endpoints.find((e) => e.name === endpointName)!;

  // Check before making the API call in case the parameters are missing
  const reservedParameters = getReservedParameters(endpoint, aggregatedApiCall.parameters || {});
  if(aggregatedApiCall.parameters.detection == 'LOGO_DETECTION'){
       reservedParameters._path = 'responses.0.logoAnnotations.0.description';
  }
  else if(aggregatedApiCall.parameters.detection == 'TEXT_DETECTION'){
       reservedParameters._path = 'responses.0.textAnnotations.0.description';
  }
  else{
       reservedParameters._path = 'responses.0.labelAnnotations.0.description';
  }


  
  if (!reservedParameters._type) {
    const log = logger.pend('ERROR', `No '_type' parameter was found for Endpoint:${endpoint.name}, OIS:${oisTitle}`);
    return [[log], { errorCode: RequestErrorCode.ReservedParametersInvalid }];
  }

  const options: adapter.BuildRequestOptions = buildOptions(
    chain,
    ois,
    aggregatedApiCall,
    reservedParameters as adapter.ReservedParameters
  );

  // Each API call is allowed API_CALL_TIMEOUT ms to complete, before it is retried until the
  // maximum timeout is reached.
  const adapterConfig: adapter.Config = { timeout: API_CALL_TIMEOUT };

  // If the request times out, we attempt to call the API again. Any other errors will not result in retries
  const retryableCall = retryOnTimeout(API_CALL_TOTAL_TIMEOUT, () =>
    adapter.buildAndExecuteRequest(options, adapterConfig)
  ) as Promise<any>;

  const [err, res] = await go(retryableCall);

  console.log("response is", res);
  if (err) {
    const log = logger.pend('ERROR', `Failed to call Endpoint:${aggregatedApiCall.endpointName}`, err);
    return [[log], { errorCode: RequestErrorCode.ApiCallFailed }];
  }

  try {
    const extracted = adapter.extractAndEncodeResponse(res.data, reservedParameters as adapter.ReservedParameters);
    console.log("extracted is",extracted);
    return [[], { value: extracted.encodedValue }];
  } catch (e) {
    const data = JSON.stringify(res?.data || {});
    const log = logger.pend('ERROR', `Unable to find response value from ${data}. Path: ${reservedParameters._path}`);
    return [[log], { errorCode: RequestErrorCode.ResponseValueNotFound }];
  }
}
