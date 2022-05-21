import { ethers } from 'ethers';
import { deriveEndpointId, deriveProviderId } from '../utils';
import { DeployState as State } from '../../types';

export async function createProviders(state: State): Promise<State> {
  for (const apiProviderName of Object.keys(state.apiProvidersByName)) {
    const apiProvider = state.apiProvidersByName[apiProviderName];

    await state.contracts
      .Airnode!.connect(apiProvider.signer)
      .createProvider(apiProvider.address, apiProvider.xpub, { value: ethers.utils.parseEther('1') });
  }
  return state;
}

export async function authorizeEndpoints(state: State): Promise<State> {
  const { Airnode } = state.contracts;

  for (const providerName of Object.keys(state.apiProvidersByName)) {
    const configApiProvider = state.config.apiProviders[providerName];
    const apiProvider = state.apiProvidersByName[providerName];
    const providerId = deriveProviderId(apiProvider.address);

    for (const endpointName of Object.keys(configApiProvider.endpoints)) {
      const configEndpoint = configApiProvider.endpoints[endpointName];
      const endpointId = deriveEndpointId(configEndpoint.oisTitle, endpointName);

      const authorizerAddresses = configEndpoint.authorizers.reduce((acc: string[], authorizerName: string) => {
        const address = state.authorizersByName[authorizerName];
        return [...acc, address];
      }, []);

      // Ethers can't estimate a gas limit here so just set it really high
      await Airnode!
        .connect(apiProvider.signer)
        .updateEndpointAuthorizers(providerId, endpointId, authorizerAddresses, { gasLimit: 8500000 });
    }
  }
  return state;
}
