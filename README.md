# Wallet Dashboard

A Web3 wallet dashboard built with Next.js, focused on common frontend tasks in Web3 applications.

The project demonstrates practical interaction with blockchain data from the frontend side: wallet connection, balances, tokens, and transaction history.

---

## Live Demo

[https://wallet-dashboard-xi.vercel.app](link)

## Features

- Wallet connection (EVM-compatible wallets)
- Native balance display
- ERC-20 token balances
- Transaction history
- Network / chain awareness
- Loading, empty and error states handling

---

## Tech Stack

- **Next.js (App Router)**
- **React**
- **TypeScript**
- **wagmi**
- **viem**
- **RainbowKit**
- **TanStack Query**
- **Alchemy SDK** (blockchain data provider)
- **Tailwind CSS**
- **Framer Motion**
- **tsParticles** (subtle background effects)

---

## What this project helps to understand

This project can be useful for frontend developers who want to better understand Web3 from a practical perspective, including:

- how wallet connection works on the frontend
- how to interact with on-chain data
- how to handle different blockchain networks
- how typical Web3 UI states look in real applications

---

## ⚙️ Getting Started

### 1. Install dependencies

```bash
npm install
# or
yarn
# or
pnpm install

```

## Setup Guide (Step-by-Step)

### Step 1: Get WalletConnect Project ID

1. Go to [https://cloud.walletconnect.com](https://cloud.walletconnect.com)
2. Sign up (free)
3. Create new project
4. Copy your Project ID
5. Add to `.env.local`:

```
   NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
```

### Step 2: Get Alchemy API Key

1. Go to [https://www.alchemy.com](https://www.alchemy.com)
2. Sign up (free tier available)
3. Create new app:
   - Chain: **Ethereum**
   - Network: **Mainnet**
4. Copy API Key
5. Add to `.env.local`:

```
   NEXT_PUBLIC_ALCHEMY_API_KEY=your_alchemy_key_here
```

### Step 3: Connect MetaMask

1. Install [MetaMask](https://metamask.io/)
2. Create wallet or import existing
3. Switch to **Ethereum Mainnet**
4. Visit your app and click "Connect Wallet"

### Key Concepts You'll Understand:

**1. Wallet Connection**

```typescript
// How to connect MetaMask
import { useAccount, useConnect } from "wagmi";

const { address, isConnected } = useAccount();
const { connect, connectors } = useConnect();
```

**2. Reading Blockchain Data**

```typescript
// How to get ETH balance
import { useBalance } from "wagmi";

const { data: balance } = useBalance({
  address: userAddress,
});
```

**3. Working with Tokens**

```typescript
// How to read ERC20 token balance
import { useReadContracts, erc20Abi } from "wagmi";

const { data } = useReadContracts({
  contracts: [
    {
      address: tokenAddress,
      abi: erc20Abi,
      functionName: "balanceOf",
      args: [userAddress],
    },
  ],
});
```

## Resources

- [wagmi Documentation](https://wagmi.sh)
- [viem Documentation](https://viem.sh)
- [Alchemy Docs](https://docs.alchemy.com)
- [Uniswap Token Lists](https://tokenlists.org/)
- [Next.js Docs](https://nextjs.org/docs)
