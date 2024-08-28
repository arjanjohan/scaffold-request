"use client";

import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import type { RequestNetwork } from "@requestnetwork/request-client.js";
import { useAccount, useWalletClient } from "wagmi";
import type { CreateInvoiceFormProps } from "~~/types";
import { config } from "~~/utils/request/config";
import { currencies } from "~~/utils/request/currencies";
import { initializeRequestNetwork } from "~~/utils/request/initializeRN";

// import '../../styles/request.css';

import("@requestnetwork/create-invoice-form");

const CreateInvoice: React.FC = () => {
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
    if (formRef.current && requestNetwork && address) {
      formRef.current.config = config;
      formRef.current.signer = address;
      formRef.current.requestNetwork = requestNetwork;
      formRef.current.currencies = currencies;
    }
  }, [requestNetwork, address]);

  return (
    <>
      <Head>
        <title>Create Invoice - Request Invoicing</title>
      </Head>
      <div className="container m-auto w-full">
        <create-invoice-form ref={formRef} />
      </div>
    </>
  );
};

export default CreateInvoice;
