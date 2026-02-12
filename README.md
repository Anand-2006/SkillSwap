# SkillSwap: Comprehensive Algorand dApp Starter Template

**SkillSwap** is a robust, full-stack decentralized application (dApp) foundation designed to accelerate Web3 development on the Algorand blockchain. Built with a modern monorepo architecture, it bridges the gap between complex smart contract logic and user-friendly frontend interfaces.

This template is engineered for developers and founders who need a production-ready environment to prototype ideas—ranging from DeFi protocols to NFT marketplaces—without spending weeks on configuration.

---

## 🚀 Core Features & Capabilities

SkillSwap comes pre-loaded with functional "cards"—modular feature sets that demonstrate critical Algorand capabilities.

### 1. Decentralized Banking System (`Bank`)

A sophisticated smart contract demonstration that functions as a non-custodial escrow.

* **Deposit & Withdraw**: Users can securely deposit ALGO into the contract and withdraw their funds.
* **State Management**: Utilizes **Box Storage** for scalable user data management and Global State for tracking total value locked (TVL).
* **Indexer Integration**: The frontend fetches real-time transaction history and depositor lists using the Algorand Indexer, demonstrating how to read on-chain data efficiently.

### 2. NFT Minting Engine (`MintNFT`)

A complete end-to-end workflow for creating digital collectibles.

* **IPFS Integration**: Seamlessly connects with **Pinata** to upload media files and metadata to the InterPlanetary File System (IPFS) before minting.
* **ARC Compliance**: Mints NFTs following Algorand Request for Comments (ARC) standards, ensuring compatibility with major wallets and marketplaces.

### 3. Asset Creation Studio (`CreateASA`)

A toolset for minting Algorand Standard Assets (ASAs).

* **Tokenomics Configuration**: Allows users to define token names, unit names, total supply, and decimal precision.
* **Fungible Tokens**: Ideal for creating loyalty points, stablecoins, or platform utility tokens.

### 4. Secure Payments (`Transact`)

A streamlined interface for blockchain transactions.

* **Multi-Asset Support**: Designed to handle ALGO transfers as well as ASA (e.g., USDC) payments.
* **Wallet Integration**: Connects with popular wallets (Pera, Defly, etc.) for signing transactions.

### 5. On-Chain Counter (`Counter`)

A foundational example for developers new to smart contracts.

* **State Manipulation**: Demonstrates the basics of application calls (AppCalls) and state updates.
* **Debugging**: Useful for testing connectivity and contract deployment flows.

---

## 🛠 Technical Architecture

The project utilizes the **AlgoKit** monorepo structure, ensuring a cohesive development lifecycle.

### Smart Contracts (Backend)

* **Language**: **Algorand Python (`algopy`)** — Writes like Python, compiles to AVM (Algorand Virtual Machine) bytecode.
* **Dependency Management**: **Poetry** — Handles Python dependencies and virtual environments.
* **Testing**: Includes a suite of tests using `pytest` and `algorand-python-testing`.

### Frontend (User Interface)

* **Framework**: **React** (v18) with **TypeScript** — High-performance component-based UI.
* **Build Tool**: **Vite** — Lightning-fast development server and bundler.
* **Styling**: **TailwindCSS** & **DaisyUI** — Utility-first CSS framework for rapid, responsive design.
* **Blockchain Client**: `@txnlab/use-wallet` for wallet connections and `algosdk` for transaction construction.

---

## 💻 Getting Started Guide

Follow these steps to set up your local development environment.

### Prerequisites

Ensure you have the following installed:

1. **Docker**: Required to run the LocalNet (Algorand Sandbox).
2. **Node.js**: Version 18 or higher.
3. **AlgoKit CLI**: The official command-line tool for Algorand development.

### Installation & Setup

1. **Clone the Repository**
```bash
git clone https://github.com/marotipatre/Hackseries-2-QuickStart-template.git
cd Hackseries-2-QuickStart-template

```


2. **Bootstrap the Project**
This command installs system-wide dependencies, sets up Python virtual environments, and installs NPM packages.
```bash
algokit project bootstrap all

```


3. **Build Smart Contracts**
Compiles your Python contracts into TEAL and generates TypeScript clients for the frontend.
```bash
algokit project run build

```


4. **Launch the Frontend**
```bash
cd projects/frontend
npm install
npm run dev

```


Your app should now be running at `http://localhost:5173`.

---

## ⚙️ Environment Configuration

To interact with the **TestNet** or use external services like Pinata, you must configure your environment variables. Create a `.env` file in `projects/frontend/`:

| Variable | Description | Recommended Value (TestNet) |
| --- | --- | --- |
| `VITE_ALGOD_SERVER` | Algorand Node URL | `https://testnet-api.algonode.cloud` |
| `VITE_ALGOD_PORT` | Node Port | *(Leave empty for AlgoNode)* |
| `VITE_ALGOD_NETWORK` | Network Name | `testnet` |
| `VITE_INDEXER_SERVER` | Indexer URL | `https://testnet-idx.algonode.cloud` |
| `VITE_PINATA_JWT` | Pinata API Token | `Your_JWT_Key_Here` (Required for NFTs) |
| `VITE_PINATA_GATEWAY` | IPFS Gateway | `https://gateway.pinata.cloud/ipfs` (Optional) |

*Note: You can generate a Pinata JWT at [pinata.cloud*](https://app.pinata.cloud/developers/api-keys).

---

## 📂 Project Structure Overview

Understanding the file layout is key to customization.

* **`projects/contracts/`**: Contains all smart contract logic.
* `smart_contracts/bank/contract.py`: The logic for the Banking app.
* `smart_contracts/counter/contract.py`: The logic for the Counter app.


* **`projects/frontend/`**: The React application.
* `src/Home.tsx`: Main landing page.
* `src/components/Bank.tsx`: UI for the Bank contract.
* `src/components/Transact.tsx`: Payment interface.
* `src/utils/pinata.ts`: Utilities for IPFS interactions.



---

## 🎨 UI Customization & AI Integration

This template is designed to be easily redesigned using AI tools. You can copy the contents of specific components and use the provided prompts in the `README.md` to restyle them with TailwindCSS without breaking the underlying logic.

**Example Components to Customize:**

* **Landing Page**: `projects/frontend/src/Home.tsx`
* **Dashboard**: `projects/frontend/src/components/Bank.tsx`
* **NFT Minter**: `projects/frontend/src/components/MintNFT.tsx`

For detailed AI prompts to redesign these components, refer to Section 4 of the original `README.md` included in the project files.