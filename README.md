# SkillSwap — Decentralized Skill & Resource Exchange

SkillSwap is a hybrid decentralized application (dApp) built on the **Algorand Blockchain**.  
It provides a marketplace where students and developers can exchange skills, complete micro-tasks for crypto, and rent computational resources such as GPUs.

The system uses a hybrid architecture:

- **On-Chain:** Algorand smart contracts handle escrow, deposits, and payments.
- **Off-Chain:** Supabase manages user profiles, authentication, and task metadata.
- **Storage:** IPFS (via Pinata) and Firebase handle file storage and media.

---

## Features

### Core Platform
- Individual tasks and group-funded task pools  
- On-chain escrow with approval-based payments  
- Task marketplace for posting and completing work  
- Wallet-based authentication using Pera  

### Extended Features
- GPU rental marketplace  
- NFT minting for skill badges  
- Hybrid login (Supabase + Wallet)  
- Multi-wallet support  

---

## Architecture Overview

Users (Browser)
│
▼
Frontend (React / Next.js / Tailwind)
│
├── Wallet (Pera) → Algorand Network (Smart Contracts)
│
▼
Backend / Worker (Node.js or Python)
│
▼
Supabase (Auth + Database)
│
▼
IPFS / Firebase Storage

---

## Repository Structure
projects/
├── contracts # Smart contracts and deployment scripts
├── frontend # React web application


### Contracts
- Written in Python using PyTeal  
- Compiled to TEAL for Algorand AVM  

### Frontend
- React + TypeScript  
- Wallet integration  
- Supabase integration  

---

## Tech Stack

**Frontend**
- React / Next.js  
- TypeScript  
- Tailwind CSS  

**Blockchain**
- Algorand  
- PyTeal Smart Contracts  
- AlgoKit  

**Backend & Storage**
- Node.js / Python  
- Supabase (Auth + DB)  
- IPFS via Pinata  
- Firebase Storage  

**Tools**
- algosdk  
- AlgoKit LocalNet  
- WalletConnect / Pera Wallet  

---

## Prerequisites

Install before running:

- Docker Desktop  
- Node.js (v18 or higher)  
- Python (3.10 or higher)  
- AlgoKit CLI  

Install AlgoKit:
pipx install algokit
## Installation & Setup

### Install AlgoKit
pipx install algokit

### Clone repository
git clone https://github.com/Anand-2006/SkillSwap.git  
cd SkillSwap

### Bootstrap dependencies
algokit bootstrap all

### Start local blockchain
algokit localnet start

### Deploy smart contracts
cd projects/contracts  
algokit project deploy localnet

### Run frontend
cd ../frontend  
npm install  
npm run dev  

Open in browser:  
http://localhost:5173


---

## Environment Variables

Inside `projects/frontend`:

cp .env.template .env

Fill values:

VITE_SUPABASE_URL=your_url  
VITE_SUPABASE_ANON_KEY=your_key  
VITE_PINATA_JWT=your_token  
VITE_GATEWAY_URL=your_gateway  
VITE_WALLETCONNECT_PROJECT_ID=your_project_id  


---

## Demo Flow

1. Connect wallet (Pera)  
2. Select mode: Individual task or Group pool  
3. Create task or create pool and set target  
4. Members deposit funds (group mode)  
5. Leader posts task  
6. Provider submits work  
7. Leader approves → payment released  
8. Show transaction on Algorand explorer  


---

## Smart Contracts

Located in:

projects/contracts

### Bank Contract
- deposit()  
- withdraw()  
- Tracks balances on-chain  

### Escrow / Task Contracts
- Lock funds  
- Release after approval  
- Refund on timeout  

### Counter Contract
- Demonstrates shared global state  


## Present Implementation 

- Wallet connectivity working (Pera, Defly, and other Algorand-compatible wallets)
- Task fulfillment flow implemented:
  - Browse tasks in the marketplace
  - Open Escrow Terminal
  - Lock ALGO into smart contract
  - Release funds securely to worker
- Compute rental flow implemented using the same escrow mechanism
- Blockchain tools operational, including:
  - Payments
  - ASA creation
  - NFT minting

---

## Troubleshooting

**App ID not found**  
Redeploy contracts after restarting LocalNet.

**Transactions failing**  
Ensure wallet is connected to LocalNet or TestNet.

**Uploads failing**  
Verify Pinata JWT token.


---

## Future Scope

- Reputation and rating system  
- DAO-based dispute resolution  
- Mobile app  
- AI-based task matching  
- Cross-campus deployment  


---

## License
MIT License


---

## Team
Penguin_on_Peak  
Hackspiration 2026
