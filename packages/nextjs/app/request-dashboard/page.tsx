"use client";

import React, { useEffect, useState } from "react";
import { RequestNetwork, Types } from "@requestnetwork/request-client.js";
import { formatUnits } from "viem";
import { useAccount } from "wagmi";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("All");

  const { address } = useAccount();
  const [totalRequestHistory, SetTotalRequestHistory] = useState<(Types.IRequestDataWithEvents | undefined)[]>();

  useEffect(() => {
    const requestClient = new RequestNetwork({
      nodeConnectionConfig: {
        baseURL: "https://xdai.gateway.request.network/",
      },
    });

    requestClient
      .fromIdentity({
        type: Types.Identity.TYPE.ETHEREUM_ADDRESS,
        value: address as string,
      })
      .then((requests) => {
        SetTotalRequestHistory(requests.map((request) => request.getData()));
      });
  }, [address]);

  const calculateStatus = (state: string, expectedAmount: bigint, balance: bigint) => {
    if (balance >= expectedAmount) {
      return "Paid";
    }
    if (state === Types.RequestLogic.STATE.ACCEPTED) {
      return "Accepted";
    } else if (state === Types.RequestLogic.STATE.CANCELED) {
      return "Canceled";
    } else if (state === Types.RequestLogic.STATE.CREATED) {
      return "Created";
    } else if (state === Types.RequestLogic.STATE.PENDING) {
      return "Pending";
    }
  };

  const filterRequests = (tab: string) => {
    if (!totalRequestHistory) return [];

    switch (tab) {
      case "All":
        return totalRequestHistory;
      case "Pay":
        return totalRequestHistory.filter(
          (request) =>
            request &&
            calculateStatus(request.state, BigInt(request.expectedAmount), BigInt(request.balance?.balance || 0)) !==
              "Paid" && request?.payer?.value === address
        );
      case "Get Paid":
        return totalRequestHistory.filter(
          (request) =>
            request &&
            calculateStatus(request.state, BigInt(request.expectedAmount), BigInt(request.balance?.balance || 0)) !==
              "Paid" && request?.payer?.value !== address
        );
      default:
        return totalRequestHistory;
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-center mb-4">
        <button
          className={`px-4 py-2 mx-2 rounded ${
            activeTab === "All" ? "bg-primary text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => setActiveTab("All")}
        >
          All
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${
            activeTab === "Pay" ? "bg-primary text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => setActiveTab("Pay")}
        >
          Pay
        </button>
        <button
          className={`px-4 py-2 mx-2 rounded ${
            activeTab === "Get Paid" ? "bg-primary text-white" : "bg-gray-200 text-black"
          }`}
          onClick={() => setActiveTab("Get Paid")}
        >
          Get Paid
        </button>
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
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filterRequests(activeTab)?.map((request, index) => (
              request && (
                <tr
                  key={index}
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => window.location.href = `/invoices/${request.requestId}`}
                >
                  <td>{new Date(request.timestamp).toLocaleDateString()}</td>
                  <td>{index + 1}</td>
                  <td>
                    {request.payer?.value.slice(0, 5)}...{request.payer?.value.slice(-4)}
                  </td>
                  <td>{formatUnits(BigInt(request.expectedAmount), 18)}</td>
                  <td>{calculateStatus(request.state, BigInt(request.expectedAmount), BigInt(request.balance?.balance || 0))}</td>
                  <td>
                    <button className="btn" disabled>
                      Download PDF
                    </button>
                  </td>
                </tr>
              )
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
