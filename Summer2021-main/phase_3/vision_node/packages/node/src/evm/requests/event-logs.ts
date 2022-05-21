import { ethers } from 'ethers';
import * as contracts from '../contracts';
import * as events from './events';
import { EVMEventLogWithMetadata } from '../../types';
import { retryOperation } from '../../utils/promise-utils';
import { OPERATION_RETRIES } from '../../constants';

interface FetchOptions {
  address: string;
  blockHistoryLimit: number;
  currentBlock: number;
  ignoreBlockedRequestsAfterBlocks: number;
  provider: ethers.providers.JsonRpcProvider;
  providerId: string;
}

interface GroupedLogs {
  apiCalls: EVMEventLogWithMetadata[];
  withdrawals: EVMEventLogWithMetadata[];
}

export async function fetch(options: FetchOptions): Promise<EVMEventLogWithMetadata[]> {
  // Protect against a potential negative fromBlock value
  const fromBlock = Math.max(0, options.currentBlock - options.blockHistoryLimit);

  const filter: ethers.providers.Filter = {
    fromBlock,
    toBlock: options.currentBlock,
    address: options.address,
    // Ethers types don't support null for a topic, even though it's valid
    // @ts-ignore
    topics: [null, options.providerId],
  };

  const operation = () => options.provider.getLogs(filter);
  const retryableOperation = retryOperation(OPERATION_RETRIES, operation);

  // Let this throw if something goes wrong
  const rawLogs = await retryableOperation;

  // If the provider returns a bad response, mapping logs could also throw
  const airnodeInterface = new ethers.utils.Interface(contracts.Airnode.ABI);
  const logsWithBlocks = rawLogs.map((log) => ({
    blockNumber: log.blockNumber,
    currentBlock: options.currentBlock,
    ignoreBlockedRequestsAfterBlocks: options.ignoreBlockedRequestsAfterBlocks,
    transactionHash: log.transactionHash,
    parsedLog: airnodeInterface.parseLog(log),
  }));

  return logsWithBlocks;
}

export function group(logsWithMetadata: EVMEventLogWithMetadata[]): GroupedLogs {
  const initialState: GroupedLogs = {
    apiCalls: [],
    withdrawals: [],
  };

  return logsWithMetadata.reduce((acc, log) => {
    const { parsedLog } = log;

    if (events.isApiCallRequest(parsedLog) || events.isApiCallFulfillment(parsedLog)) {
      return { ...acc, apiCalls: [...acc.apiCalls, log] };
    }

    if (events.isWithdrawalRequest(parsedLog) || events.isWithdrawalFulfillment(parsedLog)) {
      return { ...acc, withdrawals: [...acc.withdrawals, log] };
    }

    // Ignore other events
    return acc;
  }, initialState);
}
