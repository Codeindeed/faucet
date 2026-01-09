# MPL Faucet Challenges UI

A modern Next.js 16 application designed to interact with the Metaplex Faucet program on Solana Devnet. This UI allows users to view and complete the 5 "Rust Challenges" by burning specific MPL Core assets.

## 🚀 Features

- **Wallet Connection**: Seamless integration with Solana wallets (Phantom, Solflare, etc.) using `@solana/wallet-adapter`.
- **Challenge Dashboard**: Interactive grid displaying all 5 challenges.
- **Asset Scanning**: Automatically scans the connected wallet for assets eligible for each challenge.
- **Transaction Building**: Uses `@metaplex-foundation/umi` and the generated Faucet client to construct and sign burn transactions.
- **Real-time Feedback**: Loading states, success messages with transaction links, and error handling.

## 📋 Prerequisites

- **Node.js**: v18 or higher.
- **pnpm**: v8 or higher (preferred package manager).
- **Solana Wallet**: A wallet extension configured for **Devnet**.
- **Devnet SOL**: Required for transaction fees (use `solana airdrop 1`).

## 🛠 Installation

1.  Navigate to the UI directory:
    ```bash
    cd clients/ui
    ```

2.  Install dependencies:
    ```bash
    pnpm install
    ```

    > **Note**: This project relies on the local `mpl-faucet` JavaScript client located in `../js`. Ensure that client is built (`pnpm build` in `clients/js`) before installing UI dependencies.

## 🏃‍♂️ Running Locally

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## 🏗 Building for Production

To create an optimized production build:

```bash
pnpm build
```

The output will be in the `.next` folder. You can start the production server with `pnpm start`.

## 🧩 Project Structure

- **`app/page.tsx`**: Main dashboard logic. Handles asset fetching, filtering for each challenge, and transaction execution.
- **`components/ChallengeCard.tsx`**: Reusable component for displaying challenge details and the "Burn" action.
- **`components/UmiProvider.tsx`**: Context provider that initializes the Umi instance with `mpl-core` and `mpl-faucet` plugins. Handles wallet identity state.
- **`components/AppWalletProvider.tsx`**: Sets up the Solana Wallet Adapter context.

## ❓ Troubleshooting

- **"Wallet not initialized"**: Ensure you have connected your wallet using the "Select Wallet" button in the top right.
- **"No eligible assets found"**: You need to mint specific MPL Core assets on Devnet to satisfy the challenge requirements (e.g., assets with specific plugins like 'Attributes' or 'Edition').
- **Transaction fails**: Check your Devnet SOL balance. You need a small amount of SOL for network fees.

## 📄 License

Apache-2.0
