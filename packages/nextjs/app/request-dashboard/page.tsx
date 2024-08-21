"use client";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import type { RequestNetwork } from "@requestnetwork/request-client.js";
import { useAccount } from "wagmi";
import { InvoiceDashboardProps } from "~~/types";
import { config } from "~~/utils/request/config";
import { currencies } from "~~/utils/request/currencies";
import { initializeRequestNetwork } from "~~/utils/request/initializeRN";

import("@requestnetwork/invoice-dashboard");

export default function CreateInvoice() {
  const dashboardRef = useRef<InvoiceDashboardProps>(null);
  const { address, connector } = useAccount();
  const [requestNetwork, setRequestNetwork] = useState<RequestNetwork | null>(null);

  useEffect(() => {
    if (connector) {
      const { provider } = connector;
      initializeRequestNetwork(setRequestNetwork, provider);
    }
  }, [connector]);

  useEffect(() => {
    if (dashboardRef.current) {
      dashboardRef.current.config = config;

      if (requestNetwork) {
        dashboardRef.current.wallet = address!;
        dashboardRef.current.requestNetwork = requestNetwork;
        dashboardRef.current.currencies = currencies;
      }
    }
  }, [connector, requestNetwork]);

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
