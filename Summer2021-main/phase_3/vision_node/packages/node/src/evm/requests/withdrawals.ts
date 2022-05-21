import * as events from './events';
import * as logger from '../../logger';
import { ClientRequest, EVMEventLogWithMetadata, LogsData, RequestStatus, Withdrawal } from '../../types';

export function initialize(logWithMetadata: EVMEventLogWithMetadata): ClientRequest<Withdrawal> {
  const { parsedLog } = logWithMetadata;

  const request: ClientRequest<Withdrawal> = {
    designatedWallet: parsedLog.args.designatedWallet,
    id: parsedLog.args.withdrawalRequestId,
    status: RequestStatus.Pending,
    providerId: parsedLog.args.providerId,
    destinationAddress: parsedLog.args.destination,
    metadata: {
      blockNumber: logWithMetadata.blockNumber,
      currentBlock: logWithMetadata.currentBlock,
      ignoreBlockedRequestsAfterBlocks: logWithMetadata.ignoreBlockedRequestsAfterBlocks,
      transactionHash: logWithMetadata.transactionHash,
    },
    requesterIndex: parsedLog.args.requesterIndex.toString(),
  };

  return request;
}

export function updateFulfilledRequests(
  withdrawals: ClientRequest<Withdrawal>[],
  fulfilledRequestIds: string[]
): LogsData<ClientRequest<Withdrawal>[]> {
  const { logs, requests } = withdrawals.reduce(
    (acc, withdrawal) => {
      if (fulfilledRequestIds.includes(withdrawal.id)) {
        const log = logger.pend('DEBUG', `Request ID:${withdrawal.id} (withdrawal) has already been fulfilled`);
        const fulfilledWithdrawal = { ...withdrawal, status: RequestStatus.Fulfilled };

        return {
          ...acc,
          logs: [...acc.logs, log],
          requests: [...acc.requests, fulfilledWithdrawal],
        };
      }

      return { ...acc, requests: [...acc.requests, withdrawal] };
    },
    { logs: [], requests: [] }
  );

  return [logs, requests];
}

export function mapRequests(logsWithMetadata: EVMEventLogWithMetadata[]): LogsData<ClientRequest<Withdrawal>[]> {
  // Separate the logs
  const requestLogs = logsWithMetadata.filter((log) => events.isWithdrawalRequest(log.parsedLog));
  const fulfillmentLogs = logsWithMetadata.filter((log) => events.isWithdrawalFulfillment(log.parsedLog));

  // Cast raw logs to typed WithdrawalRequest objects
  const withdrawalRequests = requestLogs.map((log) => initialize(log));

  // Update the status of requests that have already been fulfilled
  const fulfilledRequestIds = fulfillmentLogs.map((fl) => fl.parsedLog.args.withdrawalRequestId);
  const [fulfilledLogs, withdrawalsWithFulfillments] = updateFulfilledRequests(withdrawalRequests, fulfilledRequestIds);

  return [fulfilledLogs, withdrawalsWithFulfillments];
}
