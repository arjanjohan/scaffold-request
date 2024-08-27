"use client"

import React, { useEffect, useState} from "react";
import { RequestNetwork } from "@requestnetwork/request-client.js";
import { formatUnits } from "viem";
import { useAccount, useWalletClient } from "wagmi";
import { initializeRequestNetwork } from "~~/utils/request/initializeRN";
import { calculateStatus, findCurrency } from "~~/utils/request/helper";
import { useParams } from 'next/navigation'

const InvoiceDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const invoiceid = id;

  const { address } = useAccount();
  const { data: walletClient } = useWalletClient();

  const [requestNetwork, setRequestNetwork] = useState<RequestNetwork | null>(null);
  const [invoiceData, setInvoiceData] = useState<any>(null); // State to store mapped invoice data

  // Initialize RequestNetwork when walletClient is available
  useEffect(() => {
    if (walletClient) {
      initializeRequestNetwork(setRequestNetwork, walletClient);
    }
  }, [walletClient]);

  // Fetch and map invoice data once router is ready and dependencies are met
  useEffect(() => {
    if (!invoiceid || !requestNetwork) return;

    const fetchInvoiceData = async () => {
      try {
        // Fetch the invoice using the invoice ID
        const invoice = await requestNetwork.fromRequestId(invoiceid as string);
        console.log(invoice);
        if (invoice) {
          const data = await invoice.getData();
          const content = data.contentData;

          // Extract payer and payee Ethereum addresses
          const from = data.payee.value;
          const to = data.payer.value;

          // Format dates
          const issuedDate = new Date(content.creationDate).toLocaleDateString();
          const dueDate = new Date(content.paymentTerms.dueDate).toLocaleDateString();
          const memo = content.note;
          console.log(memo);
          console.log(memo);
          console.log(memo);

          // Payment details
          console.log("data", data);
          const paymentChain = data.currencyInfo.network;
          const currencyAddress = data.currencyInfo.value;

          // State
          const expectedAmount = BigInt(data.expectedAmount);
          const balance = BigInt(data.balance?.balance || 0);
          const state = calculateStatus(data.state, expectedAmount, balance);

          const currency = findCurrency(currencyAddress, paymentChain);
          // Map invoice items
          const items = content.invoiceItems.map((item: any) => {
            const unitPrice = parseFloat(formatUnits(item.unitPrice, currency.decimals)); // Assuming 6 decimals for USDC
            const qty = item.quantity;
            const discount = parseFloat(item.discount);
            const tax = parseFloat(item.tax.amount);
            console.log("item", item);
            const amount = parseFloat(((unitPrice * qty - discount) * (1 + tax / 100)).toFixed(2));
            return {
              description: item.name,
              qty,
              unitPrice,
              discount,
              tax,
              amount,
            };
          });
          console.log(items);

          // Calculate summary totals
          const amountWithoutTax = items.reduce(
            (acc: number, item: any) => acc + (item.unitPrice * item.qty - item.discount),
            0,
          );
          const taxAmount = items.reduce(
            (acc: number, item: any) => acc + (item.unitPrice * item.qty - item.discount) * (item.tax / 100),
            0,
          );
          const totalAmount = amountWithoutTax + taxAmount;

          // Extract IPFS links
          // const ipfsCids = data.requestMeta?.transactionManagerMeta?.dataAccessMeta?.transactionsStorageLocation || [];
          // const ipfsLinks = ipfsCids.map((cid: string) => `https://ipfs.io/ipfs/${cid}`);
          const ipfsLinks = ["https://ipfs.io/ipfs/"];
          console.log(ipfsLinks);

          // Map to invoiceData structure
          const mappedInvoiceData = {
            state,
            issuedDate,
            dueDate,
            from,
            to,
            payerDetails: {}, // Placeholder for future data
            payeeDetails: {}, // Placeholder for future data
            paymentChain: paymentChain,
            currency: currency?.symbol,
            items,
            summary: {
              amountWithoutTax: parseFloat(amountWithoutTax.toFixed(2)),
              taxAmount: parseFloat(taxAmount.toFixed(2)),
              totalAmount: parseFloat(totalAmount.toFixed(2)),
            },
            memo,
            ipfsLinks,
            invoiceNumber: content.invoiceNumber, // Added to display in header
          };
          console.log(mappedInvoiceData);
          setInvoiceData(mappedInvoiceData);
          console.log(mappedInvoiceData);
        }
      } catch (error) {
        console.error("Failed to fetch invoice data:", error);
      }
    };

    fetchInvoiceData();
  }, [invoiceid, requestNetwork]);

  // Display a loading state while fetching data
  if (!invoiceData) {
    return <div>Loading...</div>;
  }

  // Helper function to render details sections
  const renderDetailsSection = (details: any) => {
    const detailFields = Object.entries(details).filter(([key, value]) => value);

    if (detailFields.length === 0) return null;

    return (
      <div className="p-4 bg-gray-100 rounded-lg">
        {detailFields.map(([key, value]) => (
          <p key={key}>
            <strong>{key.replace(/([A-Z])/g, " $1")}: </strong> {value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto bg-white p-6 rounded-lg shadow-lg">
      {/* Header Section */}
      <header className="mb-6">
        <div className="flex justify-between items-center">
        <div className="flex items-center">
            <h1 className="text-2xl font-bold mr-4">Invoice #{invoiceData.invoiceNumber}</h1>
            <button className="bg-gray-400 text-white py-2 px-4 rounded">{invoiceData.state}</button>
          </div>
          <div className="text-right">
            <p>Issued on {invoiceData.issuedDate}</p>
            <p className="font-semibold">Payment due by {invoiceData.dueDate}</p>
          </div>
        </div>
      </header>

      {/* From and Billed To Sections */}
      <section className="mb-6 flex space-x-6">
        <div className="w-1/2">
          <h2 className="text-xl font-semibold">From</h2>
          <p>{invoiceData.from}</p>
          {renderDetailsSection(invoiceData.payeeDetails)}
        </div>

        <div className="w-1/2">
          <h2 className="text-xl font-semibold">Billed To</h2>
          <p>{invoiceData.to}</p>
          {renderDetailsSection(invoiceData.payerDetails)}
        </div>
      </section>

      {/* Payment Details Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Payment Details</h2>
        <p>
          <strong>Payment Chain:</strong> {invoiceData.paymentChain}
        </p>
        <p>
          <strong>Invoice Currency:</strong> {invoiceData.currency}
        </p>
      </section>

      {/* Items Table */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Items</h2>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Description</th>
              <th className="text-left py-2">Qty</th>
              <th className="text-left py-2">Unit Price</th>
              <th className="text-left py-2">Discount</th>
              <th className="text-left py-2">Tax</th>
              <th className="text-left py-2">Amount</th>
            </tr>
          </thead>
          <tbody>
            {invoiceData.items.map((item: any, index: number) => (
              <tr key={index} className="border-b">
                <td className="py-2">{item.description}</td>
                <td className="py-2">{item.qty}</td>
                <td className="py-2">{item.unitPrice.toFixed(2)}</td>
                <td className="py-2">{item.discount.toFixed(2)}</td>
                <td className="py-2">{item.tax}%</td>
                <td className="py-2">{item.amount.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Summary Section */}
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Summary</h2>
        <div className="text-right">
          <p>
            <strong>Amount without Tax:</strong> {invoiceData.summary.amountWithoutTax.toFixed(2) +" " + invoiceData.currency}
          </p>
          <p>
            <strong>Total Tax Amount:</strong> {invoiceData.summary.taxAmount.toFixed(2) +" " + invoiceData.currency}
          </p>
          <p className="text-lg font-bold">
            <strong>Total Amount:</strong> {invoiceData.summary.totalAmount.toFixed(2) +" " + invoiceData.currency}
          </p>
          <p className="text-lg font-bold mt-4">
            <strong>Due:</strong> {invoiceData.summary.totalAmount.toFixed(2) +" " + invoiceData.currency}
          </p>
        </div>
      </section>

      
      {/* Memo Section */}
      {invoiceData.memo && 
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Memo</h2>
        <div className="p-4 bg-gray-100 rounded-lg">
          <p>{invoiceData.memo}</p>
        </div>
      </section>
      }
      

      {/* Pay Now Button */}
      { (invoiceData.state === "Created" ||  invoiceData.state === "Pending") && invoiceData.to == address && 
      <div className="text-right">
        <button className="bg-primary text-white py-2 px-4 rounded">Pay now 💸</button>
      </div>
      }
    </div>
  );
};

export default InvoiceDetails;
