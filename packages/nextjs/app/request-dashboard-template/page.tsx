"use client";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import type { RequestNetwork } from "@requestnetwork/request-client.js";
import { useWalletClient } from "wagmi";
import { InvoiceDashboardProps } from "~~/types";
import { config } from "~~/utils/request/config";
import { currencies } from "~~/utils/request/currencies";
import { initializeRequestNetwork } from "~~/utils/request/initializeRN";

import("@requestnetwork/invoice-dashboard");

export default function InvoiceOverview() {
  const dashboardRef = useRef<InvoiceDashboardProps>(null);

  const { data: walletClient } = useWalletClient();
  const [requestNetwork, setRequestNetwork] = useState<RequestNetwork | null>(null);

  useEffect(() => {
    if (walletClient) {
      initializeRequestNetwork(setRequestNetwork, walletClient);
    }
  }, [walletClient]);

  useEffect(() => {
    if (dashboardRef.current) {
      dashboardRef.current.config = config;

      if (walletClient && requestNetwork) {
        // dashboardRef.current.wallet = address!; //incorrect
        dashboardRef.current.requestNetwork = requestNetwork;
        dashboardRef.current.currencies = currencies;
      }
    }
  }, [walletClient, requestNetwork]);

  return (
    <>
      <Head>
        <title>Request Invoicing - Create an Invoice</title>
      </Head>
      <div className="container m-auto  w-[100%]">
        <invoice-dashboard ref={dashboardRef} />
      </div>
    </>
  );
}
