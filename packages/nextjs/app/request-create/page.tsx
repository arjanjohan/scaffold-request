"use client";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import type { RequestNetwork } from "@requestnetwork/request-client.js";
import { useAccount, useWalletClient } from "wagmi";
import { CreateInvoiceFormProps } from "~~/types";
import { config } from "~~/utils/request/config";
import { currencies } from "~~/utils/request/currencies";
import { initializeRequestNetwork } from "~~/utils/request/initializeRN";

import("@requestnetwork/create-invoice-form");

export default function CreateInvoice() {
  const formRef = useRef<CreateInvoiceFormProps>(null);
  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();
  const [requestNetwork, setRequestNetwork] = useState<RequestNetwork | null>(null);

  useEffect(() => {
    if (walletClient) {
      initializeRequestNetwork(setRequestNetwork, walletClient);
    }
  }, [walletClient]);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.config = config;

      if (requestNetwork) {
        formRef.current.signer = address!;
        formRef.current.requestNetwork = requestNetwork;
        formRef.current.currencies = currencies;
      }
    }
  }, [walletClient, requestNetwork]);

  return (
    <>
      <Head>
        <title>Request Invoicing - Create an Invoice</title>
      </Head>
      <div className="container m-auto  w-[100%]">
        <create-invoice-form ref={formRef} />
      </div>
    </>
  );
}
