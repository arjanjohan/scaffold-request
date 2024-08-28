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

export const keyLabelMapping: { [key: string]: string } = {
  firstName: "First Name",
  lastName: "Last Name",
  "address.country-name": "Country Name",
  "address.locality": "City",
  "address.postal-code": "Postal Code",
  "address.region": "Region",
  "address.street-address": "Street Address",
  businessName: "Company Name",
  taxRegistration: "Tax Registration",
  email: "E-mail",
};

export const displayOrder = [
  "firstName",
  "lastName",
  "businessName",
  "taxRegistration",
  "address.street-address",
  "address.locality",
  "address.postal-code",
  "address.region",
  "address.country-name",
  "email",
];
