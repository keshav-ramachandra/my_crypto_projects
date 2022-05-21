const getProviderAndBlockNumberMock = jest.fn();
const createProviderMock = jest.fn();
const estimateCreateProviderMock = jest.fn();
jest.mock('ethers', () => ({
  ethers: {
    ...jest.requireActual('ethers'),
    Contract: jest.fn().mockImplementation(() => ({
      createProvider: createProviderMock,
      estimateGas: {
        createProvider: estimateCreateProviderMock,
      },
      getProviderAndBlockNumber: getProviderAndBlockNumberMock,
    })),
  },
}));

import { ethers } from 'ethers';
import * as wallet from './wallet';
import * as providers from './providers';

describe('findWithBlock', () => {
  const options = {
    providerAdminForRecordCreation: '0x5e0051B74bb4006480A1b548af9F1F0e0954F410',
    airnodeAddress: '0xe60b966B798f9a0C41724f111225A5586ff30656',
    convenienceAddress: '0xD5659F26A72A8D718d1955C42B3AE418edB001e0',
    masterHDNode: wallet.getMasterHDNode(),
    provider: new ethers.providers.JsonRpcProvider(),
    providerId: '0xproviderId',
  };

  it('returns the admin address, xpub and current block number', async () => {
    getProviderAndBlockNumberMock.mockResolvedValueOnce({
      admin: '0x5e0051B74bb4006480A1b548af9F1F0e0954F410',
      blockNumber: ethers.BigNumber.from('12'),
      xpub:
        'xpub661MyMwAqRbcGeCE1g3KTUVGZsFDE3jMNinRPGCQGQsAp1nwinB9Pi16ihKPJw7qtaaTFuBHbRPeSc6w3AcMjxiHkAPfyp1hqQRbthv4Ryx',
    });
    const [logs, res] = await providers.findWithBlock(options);
    expect(logs).toEqual([
      { level: 'INFO', message: 'Fetching current block and provider admin details...' },
      { level: 'INFO', message: 'Current block:12' },
      { level: 'INFO', message: 'Admin address:0x5e0051B74bb4006480A1b548af9F1F0e0954F410' },
      {
        level: 'INFO',
        message:
          'Provider extended public key:xpub661MyMwAqRbcGeCE1g3KTUVGZsFDE3jMNinRPGCQGQsAp1nwinB9Pi16ihKPJw7qtaaTFuBHbRPeSc6w3AcMjxiHkAPfyp1hqQRbthv4Ryx',
      },
    ]);
    expect(res).toEqual({
      providerAdminForRecordCreation: '0x5e0051B74bb4006480A1b548af9F1F0e0954F410',
      blockNumber: 12,
      providerExists: true,
      xpub:
        'xpub661MyMwAqRbcGeCE1g3KTUVGZsFDE3jMNinRPGCQGQsAp1nwinB9Pi16ihKPJw7qtaaTFuBHbRPeSc6w3AcMjxiHkAPfyp1hqQRbthv4Ryx',
    });
    expect(getProviderAndBlockNumberMock).toHaveBeenCalledTimes(1);
    expect(getProviderAndBlockNumberMock).toHaveBeenCalledWith('0xproviderId');
  });

  it('checks that the extended public key exists', async () => {
    getProviderAndBlockNumberMock.mockResolvedValueOnce({
      admin: '0x5e0051B74bb4006480A1b548af9F1F0e0954F410',
      blockNumber: ethers.BigNumber.from('12'),
      xpub: '',
    });
    const [logs, res] = await providers.findWithBlock(options);
    expect(logs).toEqual([
      { level: 'INFO', message: 'Fetching current block and provider admin details...' },
      { level: 'INFO', message: 'Current block:12' },
      { level: 'INFO', message: 'Provider not found' },
    ]);
    expect(res).toEqual({
      providerAdminForRecordCreation: '0x5e0051B74bb4006480A1b548af9F1F0e0954F410',
      blockNumber: 12,
      providerExists: false,
      xpub: '',
    });
    expect(getProviderAndBlockNumberMock).toHaveBeenCalledTimes(1);
    expect(getProviderAndBlockNumberMock).toHaveBeenCalledWith('0xproviderId');
  });

  it('retries once on failure', async () => {
    getProviderAndBlockNumberMock.mockRejectedValueOnce(new Error('Server says no'));
    getProviderAndBlockNumberMock.mockResolvedValueOnce({
      admin: '0x5e0051B74bb4006480A1b548af9F1F0e0954F410',
      blockNumber: ethers.BigNumber.from('12'),
      xpub:
        'xpub661MyMwAqRbcGeCE1g3KTUVGZsFDE3jMNinRPGCQGQsAp1nwinB9Pi16ihKPJw7qtaaTFuBHbRPeSc6w3AcMjxiHkAPfyp1hqQRbthv4Ryx',
    });
    const [logs, res] = await providers.findWithBlock(options);
    expect(logs).toEqual([
      { level: 'INFO', message: 'Fetching current block and provider admin details...' },
      { level: 'INFO', message: 'Current block:12' },
      { level: 'INFO', message: 'Admin address:0x5e0051B74bb4006480A1b548af9F1F0e0954F410' },
      {
        level: 'INFO',
        message:
          'Provider extended public key:xpub661MyMwAqRbcGeCE1g3KTUVGZsFDE3jMNinRPGCQGQsAp1nwinB9Pi16ihKPJw7qtaaTFuBHbRPeSc6w3AcMjxiHkAPfyp1hqQRbthv4Ryx',
      },
    ]);
    expect(res).toEqual({
      providerAdminForRecordCreation: '0x5e0051B74bb4006480A1b548af9F1F0e0954F410',
      blockNumber: 12,
      providerExists: true,
      xpub:
        'xpub661MyMwAqRbcGeCE1g3KTUVGZsFDE3jMNinRPGCQGQsAp1nwinB9Pi16ihKPJw7qtaaTFuBHbRPeSc6w3AcMjxiHkAPfyp1hqQRbthv4Ryx',
    });
    expect(getProviderAndBlockNumberMock).toHaveBeenCalledTimes(2);
    expect(getProviderAndBlockNumberMock.mock.calls).toEqual([['0xproviderId'], ['0xproviderId']]);
  });

  it('returns null if the retries are exhausted', async () => {
    getProviderAndBlockNumberMock.mockRejectedValueOnce(new Error('Server says no'));
    getProviderAndBlockNumberMock.mockRejectedValueOnce(new Error('Server says no'));
    const [logs, res] = await providers.findWithBlock(options);
    expect(logs).toEqual([
      { level: 'INFO', message: 'Fetching current block and provider admin details...' },
      {
        level: 'ERROR',
        message: 'Unable to fetch current block and provider admin details',
        error: new Error('Server says no'),
      },
    ]);
    expect(res).toEqual(null);
    expect(getProviderAndBlockNumberMock).toHaveBeenCalledTimes(2);
    expect(getProviderAndBlockNumberMock.mock.calls).toEqual([['0xproviderId'], ['0xproviderId']]);
  });
});

describe('create', () => {
  const options = {
    providerAdminForRecordCreation: '0x5e0051B74bb4006480A1b548af9F1F0e0954F410',
    airnodeAddress: '0xe60b966B798f9a0C41724f111225A5586ff30656',
    convenienceAddress: '0xD5659F26A72A8D718d1955C42B3AE418edB001e0',
    masterHDNode: wallet.getMasterHDNode(),
    provider: new ethers.providers.JsonRpcProvider(),
    xpub:
      'xpub661MyMwAqRbcGeCE1g3KTUVGZsFDE3jMNinRPGCQGQsAp1nwinB9Pi16ihKPJw7qtaaTFuBHbRPeSc6w3AcMjxiHkAPfyp1hqQRbthv4Ryx',
  };

  it('creates the provider and returns the transaction', async () => {
    const gasPriceSpy = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, 'getGasPrice');
    gasPriceSpy.mockResolvedValueOnce(ethers.BigNumber.from(1000));
    const balanceSpy = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, 'getBalance');
    balanceSpy.mockResolvedValueOnce(ethers.BigNumber.from(250_000_000));
    estimateCreateProviderMock.mockResolvedValueOnce(ethers.BigNumber.from(50_000));
    createProviderMock.mockResolvedValueOnce({ hash: '0xsuccessful' });
    const [logs, res] = await providers.create(options);
    expect(logs).toEqual([
      { level: 'INFO', message: 'Creating provider with address:0x5e0051B74bb4006480A1b548af9F1F0e0954F410...' },
      { level: 'INFO', message: 'Estimating transaction cost for creating provider...' },
      { level: 'INFO', message: 'Estimated gas limit: 70000' },
      { level: 'INFO', message: 'Gas price set to 0.000001 Gwei' },
      { level: 'INFO', message: 'Master wallet balance: 0.00000000025 ETH' },
      { level: 'INFO', message: 'Submitting create provider transaction...' },
      { level: 'INFO', message: 'Create provider transaction submitted:0xsuccessful' },
      {
        level: 'INFO',
        message: 'Airnode will not process requests until the create provider transaction has been confirmed',
      },
    ]);
    expect(res).toEqual({ hash: '0xsuccessful' });
    expect(estimateCreateProviderMock).toHaveBeenCalledTimes(1);
    expect(createProviderMock).toHaveBeenCalledTimes(1);
    expect(createProviderMock).toHaveBeenCalledWith(
      '0x5e0051B74bb4006480A1b548af9F1F0e0954F410',
      'xpub661MyMwAqRbcGeCE1g3KTUVGZsFDE3jMNinRPGCQGQsAp1nwinB9Pi16ihKPJw7qtaaTFuBHbRPeSc6w3AcMjxiHkAPfyp1hqQRbthv4Ryx',
      {
        // 250_000_000 - ((50_000 + 20_000) * 1000)
        value: ethers.BigNumber.from(180_000_000),
        gasPrice: ethers.BigNumber.from(1000),
        gasLimit: ethers.BigNumber.from(70_000),
      }
    );
  });

  it('returns null if the gas limit estimate fails', async () => {
    estimateCreateProviderMock.mockRejectedValueOnce(new Error('Unable to estimate gas limit'));
    estimateCreateProviderMock.mockRejectedValueOnce(new Error('Unable to estimate gas limit'));
    const [logs, res] = await providers.create(options);
    expect(logs).toEqual([
      { level: 'INFO', message: 'Creating provider with address:0x5e0051B74bb4006480A1b548af9F1F0e0954F410...' },
      { level: 'INFO', message: 'Estimating transaction cost for creating provider...' },
      {
        level: 'ERROR',
        message: 'Unable to estimate transaction cost',
        error: new Error('Unable to estimate gas limit'),
      },
    ]);
    expect(res).toEqual(null);
    expect(estimateCreateProviderMock).toHaveBeenCalledTimes(2);
    expect(createProviderMock).not.toHaveBeenCalled();
  });

  it('returns null if the gas price cannot be fetched', async () => {
    const gasPriceSpy = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, 'getGasPrice');
    gasPriceSpy.mockRejectedValueOnce(new Error('Failed to fetch gas price'));
    gasPriceSpy.mockRejectedValueOnce(new Error('Failed to fetch gas price'));
    estimateCreateProviderMock.mockResolvedValueOnce(ethers.BigNumber.from(50_000));
    const [logs, res] = await providers.create(options);
    expect(logs).toEqual([
      { level: 'INFO', message: 'Creating provider with address:0x5e0051B74bb4006480A1b548af9F1F0e0954F410...' },
      { level: 'INFO', message: 'Estimating transaction cost for creating provider...' },
      { level: 'INFO', message: 'Estimated gas limit: 70000' },
      { level: 'ERROR', message: 'Unable to fetch gas price', error: new Error('Failed to fetch gas price') },
    ]);
    expect(res).toEqual(null);
    expect(estimateCreateProviderMock).toHaveBeenCalledTimes(1);
    expect(createProviderMock).not.toHaveBeenCalled();
  });

  it('returns null if the master wallet balance cannot be fetched', async () => {
    const gasPriceSpy = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, 'getGasPrice');
    gasPriceSpy.mockResolvedValueOnce(ethers.BigNumber.from(1000));
    const balanceSpy = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, 'getBalance');
    balanceSpy.mockRejectedValueOnce(new Error('Failed to fetch balance'));
    balanceSpy.mockRejectedValueOnce(new Error('Failed to fetch balance'));
    estimateCreateProviderMock.mockResolvedValueOnce(ethers.BigNumber.from(50_000));
    const [logs, res] = await providers.create(options);
    expect(logs).toEqual([
      { level: 'INFO', message: 'Creating provider with address:0x5e0051B74bb4006480A1b548af9F1F0e0954F410...' },
      { level: 'INFO', message: 'Estimating transaction cost for creating provider...' },
      { level: 'INFO', message: 'Estimated gas limit: 70000' },
      { level: 'INFO', message: 'Gas price set to 0.000001 Gwei' },
      { level: 'ERROR', message: 'Unable to fetch master wallet balance', error: new Error('Failed to fetch balance') },
    ]);
    expect(res).toEqual(null);
    expect(estimateCreateProviderMock).toHaveBeenCalledTimes(1);
    expect(createProviderMock).not.toHaveBeenCalled();
  });

  it('returns null if the create provider transaction fails to submit', async () => {
    const gasPriceSpy = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, 'getGasPrice');
    gasPriceSpy.mockResolvedValueOnce(ethers.BigNumber.from(1000));
    const balanceSpy = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, 'getBalance');
    balanceSpy.mockResolvedValueOnce(ethers.BigNumber.from(250_000_000));
    estimateCreateProviderMock.mockResolvedValueOnce(ethers.BigNumber.from(50_000));
    createProviderMock.mockRejectedValueOnce(new Error('Failed to submit tx'));
    createProviderMock.mockRejectedValueOnce(new Error('Failed to submit tx'));
    const [logs, res] = await providers.create(options);
    expect(logs).toEqual([
      { level: 'INFO', message: 'Creating provider with address:0x5e0051B74bb4006480A1b548af9F1F0e0954F410...' },
      { level: 'INFO', message: 'Estimating transaction cost for creating provider...' },
      { level: 'INFO', message: 'Estimated gas limit: 70000' },
      { level: 'INFO', message: 'Gas price set to 0.000001 Gwei' },
      { level: 'INFO', message: 'Master wallet balance: 0.00000000025 ETH' },
      { level: 'INFO', message: 'Submitting create provider transaction...' },
      {
        level: 'ERROR',
        message: 'Unable to submit create provider transaction',
        error: new Error('Failed to submit tx'),
      },
    ]);
    expect(res).toEqual(null);
    expect(estimateCreateProviderMock).toHaveBeenCalledTimes(1);
    expect(createProviderMock).toHaveBeenCalledTimes(2);
    expect(createProviderMock).toHaveBeenCalledWith(
      '0x5e0051B74bb4006480A1b548af9F1F0e0954F410',
      'xpub661MyMwAqRbcGeCE1g3KTUVGZsFDE3jMNinRPGCQGQsAp1nwinB9Pi16ihKPJw7qtaaTFuBHbRPeSc6w3AcMjxiHkAPfyp1hqQRbthv4Ryx',
      {
        // 250_000_000 - ((50_000 + 20_000) * 1000)
        value: ethers.BigNumber.from(180_000_000),
        gasPrice: ethers.BigNumber.from(1000),
        gasLimit: ethers.BigNumber.from(70_000),
      }
    );
  });
});

describe('findOrCreateProviderWithBlock', () => {
  const options = {
    providerAdminForRecordCreation: '0x5e0051B74bb4006480A1b548af9F1F0e0954F410',
    airnodeAddress: '0xe60b966B798f9a0C41724f111225A5586ff30656',
    convenienceAddress: '0xD5659F26A72A8D718d1955C42B3AE418edB001e0',
    masterHDNode: wallet.getMasterHDNode(),
    provider: new ethers.providers.JsonRpcProvider(),
  };

  it('returns null if it fails to get the provider and block data', async () => {
    getProviderAndBlockNumberMock.mockRejectedValueOnce(new Error('Server says no'));
    getProviderAndBlockNumberMock.mockRejectedValueOnce(new Error('Server says no'));
    const [logs, res] = await providers.findOrCreateProviderWithBlock(options);
    expect(logs).toEqual([
      {
        level: 'DEBUG',
        message:
          'Computed provider ID from mnemonic:0x19255a4ec31e89cea54d1f125db7536e874ab4a96b4d4f6438668b6bb10a6adb',
      },
      { level: 'INFO', message: 'Fetching current block and provider admin details...' },
      {
        level: 'ERROR',
        message: 'Unable to fetch current block and provider admin details',
        error: new Error('Server says no'),
      },
    ]);
    expect(res).toEqual(null);
    expect(getProviderAndBlockNumberMock).toHaveBeenCalledTimes(2);
    expect(getProviderAndBlockNumberMock.mock.calls).toEqual([
      ['0x19255a4ec31e89cea54d1f125db7536e874ab4a96b4d4f6438668b6bb10a6adb'],
      ['0x19255a4ec31e89cea54d1f125db7536e874ab4a96b4d4f6438668b6bb10a6adb'],
    ]);
  });

  it('returns null if attemping creating the provider without providerAdminForRecordCreation', async () => {
    getProviderAndBlockNumberMock.mockResolvedValueOnce({
      admin: '0x5e0051B74bb4006480A1b548af9F1F0e0954F410',
      blockNumber: ethers.BigNumber.from('12'),
      xpub: '',
    });
    const [logs, res] = await providers.findOrCreateProviderWithBlock({
      ...options,
      providerAdminForRecordCreation: undefined,
    });
    expect(logs).toEqual([
      {
        level: 'DEBUG',
        message:
          'Computed provider ID from mnemonic:0x19255a4ec31e89cea54d1f125db7536e874ab4a96b4d4f6438668b6bb10a6adb',
      },
      { level: 'INFO', message: 'Fetching current block and provider admin details...' },
      { level: 'INFO', message: 'Current block:12' },
      { level: 'INFO', message: 'Provider not found' },
      { level: 'ERROR', message: 'Unable to find providerAdminForRecordCreation address' },
    ]);
    expect(res).toEqual(null);
    expect(getProviderAndBlockNumberMock).toHaveBeenCalledTimes(1);
    expect(getProviderAndBlockNumberMock).toHaveBeenCalledWith(
      '0x19255a4ec31e89cea54d1f125db7536e874ab4a96b4d4f6438668b6bb10a6adb'
    );
    expect(estimateCreateProviderMock).not.toHaveBeenCalled();
    expect(createProviderMock).not.toHaveBeenCalled();
  });

  it('creates a provider if xpub if empty and returns the transaction', async () => {
    getProviderAndBlockNumberMock.mockResolvedValueOnce({
      admin: '0x5e0051B74bb4006480A1b548af9F1F0e0954F410',
      blockNumber: ethers.BigNumber.from('12'),
      xpub: '',
    });
    const gasPriceSpy = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, 'getGasPrice');
    gasPriceSpy.mockResolvedValueOnce(ethers.BigNumber.from(1000));
    const balanceSpy = jest.spyOn(ethers.providers.JsonRpcProvider.prototype, 'getBalance');
    balanceSpy.mockResolvedValueOnce(ethers.BigNumber.from(250_000_000));
    estimateCreateProviderMock.mockResolvedValueOnce(ethers.BigNumber.from(50_000));
    createProviderMock.mockResolvedValueOnce({ hash: '0xsuccessful' });
    const [logs, res] = await providers.findOrCreateProviderWithBlock(options);
    expect(logs).toEqual([
      {
        level: 'DEBUG',
        message:
          'Computed provider ID from mnemonic:0x19255a4ec31e89cea54d1f125db7536e874ab4a96b4d4f6438668b6bb10a6adb',
      },
      { level: 'INFO', message: 'Fetching current block and provider admin details...' },
      { level: 'INFO', message: 'Current block:12' },
      { level: 'INFO', message: 'Provider not found' },
      { level: 'INFO', message: 'Creating provider with address:0x5e0051B74bb4006480A1b548af9F1F0e0954F410...' },
      { level: 'INFO', message: 'Estimating transaction cost for creating provider...' },
      { level: 'INFO', message: 'Estimated gas limit: 70000' },
      { level: 'INFO', message: 'Gas price set to 0.000001 Gwei' },
      { level: 'INFO', message: 'Master wallet balance: 0.00000000025 ETH' },
      { level: 'INFO', message: 'Submitting create provider transaction...' },
      { level: 'INFO', message: 'Create provider transaction submitted:0xsuccessful' },
      {
        level: 'INFO',
        message: 'Airnode will not process requests until the create provider transaction has been confirmed',
      },
    ]);
    expect(res).toEqual({
      providerAdminForRecordCreation: '0x5e0051B74bb4006480A1b548af9F1F0e0954F410',
      blockNumber: 12,
      providerExists: false,
      xpub: '',
    });
    expect(getProviderAndBlockNumberMock).toHaveBeenCalledTimes(1);
    expect(getProviderAndBlockNumberMock).toHaveBeenCalledWith(
      '0x19255a4ec31e89cea54d1f125db7536e874ab4a96b4d4f6438668b6bb10a6adb'
    );
    expect(estimateCreateProviderMock).toHaveBeenCalledTimes(1);
    expect(createProviderMock).toHaveBeenCalledTimes(1);
    expect(createProviderMock).toHaveBeenCalledWith(
      '0x5e0051B74bb4006480A1b548af9F1F0e0954F410',
      'xpub661MyMwAqRbcGeCE1g3KTUVGZsFDE3jMNinRPGCQGQsAp1nwinB9Pi16ihKPJw7qtaaTFuBHbRPeSc6w3AcMjxiHkAPfyp1hqQRbthv4Ryx',
      {
        // 250_000_000 - ((50_000 + 20_000) * 1000)
        value: ethers.BigNumber.from(180_000_000),
        gasPrice: ethers.BigNumber.from(1000),
        gasLimit: ethers.BigNumber.from(70_000),
      }
    );
  });

  it('returns the provider data and block if the provider already exists', async () => {
    getProviderAndBlockNumberMock.mockResolvedValueOnce({
      admin: '0x5e0051B74bb4006480A1b548af9F1F0e0954F410',
      blockNumber: ethers.BigNumber.from('12'),
      xpub:
        'xpub661MyMwAqRbcGeCE1g3KTUVGZsFDE3jMNinRPGCQGQsAp1nwinB9Pi16ihKPJw7qtaaTFuBHbRPeSc6w3AcMjxiHkAPfyp1hqQRbthv4Ryx',
    });
    const [logs, res] = await providers.findOrCreateProviderWithBlock(options);
    expect(logs).toEqual([
      {
        level: 'DEBUG',
        message:
          'Computed provider ID from mnemonic:0x19255a4ec31e89cea54d1f125db7536e874ab4a96b4d4f6438668b6bb10a6adb',
      },
      { level: 'INFO', message: 'Fetching current block and provider admin details...' },
      { level: 'INFO', message: 'Current block:12' },
      { level: 'INFO', message: 'Admin address:0x5e0051B74bb4006480A1b548af9F1F0e0954F410' },
      {
        level: 'INFO',
        message:
          'Provider extended public key:xpub661MyMwAqRbcGeCE1g3KTUVGZsFDE3jMNinRPGCQGQsAp1nwinB9Pi16ihKPJw7qtaaTFuBHbRPeSc6w3AcMjxiHkAPfyp1hqQRbthv4Ryx',
      },
      { level: 'DEBUG', message: 'Skipping provider creation as the provider exists' },
    ]);
    expect(res).toEqual({
      providerAdminForRecordCreation: '0x5e0051B74bb4006480A1b548af9F1F0e0954F410',
      blockNumber: 12,
      providerExists: true,
      xpub:
        'xpub661MyMwAqRbcGeCE1g3KTUVGZsFDE3jMNinRPGCQGQsAp1nwinB9Pi16ihKPJw7qtaaTFuBHbRPeSc6w3AcMjxiHkAPfyp1hqQRbthv4Ryx',
    });
    expect(getProviderAndBlockNumberMock).toHaveBeenCalledTimes(1);
    expect(getProviderAndBlockNumberMock).toHaveBeenCalledWith(
      '0x19255a4ec31e89cea54d1f125db7536e874ab4a96b4d4f6438668b6bb10a6adb'
    );
    expect(createProviderMock).not.toHaveBeenCalled();
  });
});
