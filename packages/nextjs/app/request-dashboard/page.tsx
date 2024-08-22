"use client";

import React, { useEffect, useState } from "react";
import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"All" | "Pay" | "Get Paid">("All");
  const { address } = useAccount();
  const [totalRequestHistory, setTotalRequestHistory] = useState<Types.IRequestDataWithEvents[] | undefined>();

  useEffect(() => {
    if (!address) return;

    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: "https://xdai.gateway.request.network/",
      },
    });

    requestClient
      .fromIdentity({
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: address,
      })
      .then(requests => {
        setTotalRequestHistory(requests.map(request => request.getData()));
      })
      .catch(error => {
        console.error("Failed to fetch request history:", error);
      });
  }, [address]);

  const calculateStatus = (state: string, expectedAmount: bigint, balance: bigint) => {
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

  const filterRequests = (tab: "All" | "Pay" | "Get Paid") => {
    if (!totalRequestHistory) return [];

    return totalRequestHistory.filter(request => {
      if (!request) return false;
      const status = calculateStatus(
        request.state,
        BigInt(request.expectedAmount),
        BigInt(request.balance?.balance || 0),
      );
      const isPayer = request.payer?.value === address;

      if (tab === "All") return true;
      if (tab === "Pay" && isPayer && status !== "Paid") return true;
      if (tab === "Get Paid" && !isPayer && status !== "Paid") return true;

      return false;
    });
  };

  return (
    <div className="p-8">
      <div className="flex justify-center mb-4">
        {["All", "Pay", "Get Paid"].map(tab => (
          <button
            key={tab}
            className={`px-4 py-2 mx-2 rounded ${
              activeTab === tab ? "bg-primary text-white" : "bg-gray-200 text-black"
            }`}
            onClick={() => setActiveTab(tab as "All" | "Pay" | "Get Paid")}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
        <table className="table w-full min-w-max">
          <thead>
            <tr>
              <th>Created</th>
              <th>Invoice #</th>
              <th>Payer</th>
              <th>Expected Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filterRequests(activeTab)?.map(
              (request, index) =>
                request && (
                  <tr
                    key={request.requestId}
                    className="cursor-pointer hover:bg-gray-100"
                    onClick={() => (window.location.href = `/invoices/${request.requestId}`)}
                  >
                    <td>{new Date(request.timestamp).toLocaleDateString()}</td>
                    <td>{index + 1}</td>
                    <td>
                      {request.payer?.value.slice(0, 5)}...{request.payer?.value.slice(-4)}
                    </td>
                    <td>{formatUnits(BigInt(request.expectedAmount), 18)}</td>
                    <td>
                      {calculateStatus(
                        request.state,
                        BigInt(request.expectedAmount),
                        BigInt(request.balance?.balance || 0),
                      )}
                    </td>
                    <td>
                      <button className="btn" disabled>
                        Download PDF
                      </button>
                    </td>
                  </tr>
                ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
