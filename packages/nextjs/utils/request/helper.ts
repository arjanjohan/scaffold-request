import { Types } from "@requestnetwork/request-client.js";
import { providers } from "ethers";
import type { Chain, Client, Transport } from "viem";
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

export function clientToSigner(address: string, chain: Chain) {
  const network = {
    chainId: chain.id,
    name: chain.name,
    ensAddress: chain.contracts?.ensRegistry?.address,
  };
  console.log("chain", chain);
  const rpc_url = chain.rpcUrls.default.http[0];
  console.log("rpc_url", rpc_url);
  const provider = new providers.JsonRpcProvider(rpc_url, network);
  const signer = provider.getSigner(address);
  console.log("signer", signer);
  return signer;
}
export function clientToProvider(chain_id: number, chain_name: string, ens_address: string, rpc_url: string) {
  const network = {
    chainId: chain_id,
    name: chain_name,
    ensAddress: ens_address,
  };
  console.log("rpc_url", rpc_url);
  return new providers.JsonRpcProvider(rpc_url, network);
}

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

