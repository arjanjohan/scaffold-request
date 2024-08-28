# 🏗 Scaffold-ETH 2 and Request Network

Uses Request Network to create and view invoices..

```shell
npx create-eth@latest -e request-network
```

## 💸 Request Network

[Request Network](https://request.network/) is a decentralized platform that allows you to create, manage, and pay invoices seamlessly on the blockchain.

- 🧾 **Decentralized Invoicing**: Request Network enables the creation and management of invoices on the blockchain, ensuring transparency, security, and trust between parties.
- 💰 **Efficient Payments**: The platform facilitates swift, secure payments in various cryptocurrencies, providing flexibility for global transactions.
- 🌐 **Collaborative Ecosystem**: Request Network empowers businesses and developers to integrate invoicing and payment functionalities into their applications, promoting innovation and collaboration!

For detailed instructions and more context, check out the [Developer Documentation](https://docs.request.network/).

## Pages and components

### Create Invoice
The Create Invoice page leverages the [`create-invoice-form`](https://docs.request.network/building-blocks/components/create-invoice-form) component created by Request Network.

### Invoice Dashboard
Custom page that displays an overview of invoices sent and received. Clicking on an invoice takes you to the `Invoice Details` page for this invoice. 

### Invoice Details
Custom pages that displays the details of an invoice.

## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.17)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart



## What's next?

This SE2 extension is not complete yet. The following changes are still needed:

- Replace dashboard page by the Request Network template, which is blocked by [this issue](https://github.com/RequestNetwork/web-components/issues/31). The dashboard template is now not complatible with the SE2 wallet provider, but the work in progress implementation is available at `packages/nextjs/app/request-dashboard-template` currently.
- add externalContracts for Request Network
- Pay invoice button logic