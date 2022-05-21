import { ethers } from 'ethers';
import { DeployState as State } from '../../types';

export async function fundProviderAccounts(state: State): Promise<State> {
  for (const apiProviderName of Object.keys(state.apiProvidersByName)) {
    const apiProvider = state.apiProvidersByName[apiProviderName];
    // Ensure that the API provider address has enough ETH to create the onchain provider
    await state.deployer.sendTransaction({
      to: apiProvider.address,
      value: ethers.utils.parseEther('5'),
    });
  }
  return state;
}

export async function fundRequesterAccounts(state: State): Promise<State> {
  for (const requesterId of Object.keys(state.requestersById)) {
    const requester = state.requestersById[requesterId];
    await state.deployer.sendTransaction({
      to: requester.address,
      value: ethers.utils.parseEther('1'),
    });
  }
  return state;
}

export async function fundDesignatedWallets(state: State): Promise<State> {
  for (const configRequester of state.config.requesters) {
    const requester = state.requestersById[configRequester.id];
    for (const designatedWallet of requester.designatedWallets) {
      const ethAmount = configRequester.apiProviders[designatedWallet.apiProviderName].ethBalance;
      await state.deployer.sendTransaction({
        to: designatedWallet.address,
        value: ethers.utils.parseEther(ethAmount),
      });
    }
  }
  return state;
}
