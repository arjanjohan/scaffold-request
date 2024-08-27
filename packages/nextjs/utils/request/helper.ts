import { Types } from "@requestnetwork/request-client.js";
import { currencies } from "~~/utils/request/currencies";

export const calculateStatus = (state: string, expectedAmount: bigint, balance: bigint) => {
  if (balance >= expectedAmount) {
    return "Paid";
  }
  switch (state) {
    case Types.RequestLogic.STATE.ACCEPTED:
      return "Accepted";
    case Types.RequestLogic.STATE.CANCELED:
      return "Canceled";
    case Types.RequestLogic.STATE.CREATED:
      return "Created";
    case Types.RequestLogic.STATE.PENDING:
      return "Pending";
    default:
      return "Unknown";
  }
};

export const findCurrency = (currencyAddress: string, network: string) => {
  return currencies.find(
    currency =>
      currency.address.toLowerCase() === currencyAddress.toLowerCase() &&
      currency.network.toLowerCase() === network.toLowerCase(),
  );
};
