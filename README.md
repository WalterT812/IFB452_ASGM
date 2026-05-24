# MedLink 🏥
### IFB452 — Blockchain Technology | Group 35

> *Because emergencies don't wait for paperwork.*

MedLink is a permissioned blockchain-based medical record system that enables verified clinicians to securely access patient records across institutions in real time — even when the patient is unconscious.

---

## 👥 Team
- Zi Himm Lim — n12333913
- Walter Tang — n12257079

---

## 📋 Project Overview

Medical records fragmented across independent hospital databases create critical risks in emergencies. MedLink solves this by providing role-verified, time-bounded emergency access to patient records — with every access event permanently logged on the blockchain.

---

## 🏗️ System Architecture
Frontend (HTML/CSS/JS)
↓
Ethers.js — connects frontend to blockchain
↓
Smart Contracts (Solidity) on Private Ethereum (Ganache)
↓
Off-chain Database (SQLite) — stores actual records
Blockchain — stores cryptographic hashes only
---

## 📄 Smart Contracts

| Contract | Purpose |
|---|---|
| `EmergencyAccess.sol` | Verifies provider role, surfaces role-appropriate data, auto-revokes after 15 minutes |
| `AuditLog.sol` | Permanently records every access event, triggered automatically |
| `PatientConsent.sol` | Manages patient consent for insurance access |

---

## 👤 Stakeholders & Roles

| Stakeholder | Role |
|---|---|
| Institution (Admin) | Registers providers, submits patient records, manages consent |
| Paramedic | Emergency access — triage data only |
| Physician | Emergency access — full medical history |
| Insurance Provider | Read access — only when patient grants consent |

---

## 🚀 How to Run

### Prerequisites
- [Node.js](https://nodejs.org)
- [Ganache](https://trufflesuite.com/ganache)
- [Remix IDE](https://remix.ethereum.org)
- VS Code with Live Server extension

### Step 1 — Start Ganache
1. Open Ganache
2. Load your workspace
3. Note the RPC URL: `HTTP://127.0.0.1:7545`

### Step 2 — Deploy Contracts
1. Open Remix IDE
2. Connect to Ganache via **Custom External HTTP Provider**
3. Deploy in this order:
   - `AuditLog.sol` first — copy contract address
   - `EmergencyAccess.sol` — paste AuditLog address in constructor
   - `PatientConsent.sol` — no constructor input needed
4. Copy each contract address into `frontend/js/config.js`

### Step 3 — Run Frontend
1. Open `IFB452_ASGM` in VS Code
2. Right-click `frontend/index.html`
3. Click **Open with Live Server**
4. Browser opens at `http://127.0.0.1:5500`

---

## 📁 Project Structure
IFB452_ASGM/
├── EmergencyAccess.sol      — emergency access smart contract
├── AuditLog.sol             — audit log smart contract
├── PatientConsent.sol       — patient consent smart contract
├── frontend/
│   ├── index.html           — role selector landing page
│   ├── institution.html     — institution dashboard
│   ├── provider.html        — paramedic/physician access
│   ├── audit.html           — audit log viewer
│   └── js/
│       ├── config.js        — contract addresses and ABIs
│       ├── institution.js   — institution logic
│       ├── provider.js      — provider access logic
│       └── audit.js         — audit log logic
└── README.md
---

## ⚠️ Current Status

- [x] EmergencyAccess.sol — complete
- [x] AuditLog.sol — complete
- [x] PatientConsent.sol — complete
- [x] Frontend HTML — complete
- [ ] config.js — pending contract deployment
- [ ] institution.js — in progress
- [ ] provider.js — in progress
- [ ] audit.js — in progress
- [ ] End to end testing — pending

---

## 🔐 Test Accounts (Ganache — MONIC Workspace)

| Index | Address | Role |
|---|---|---|
| 0 | 0x0560...7c61 | Admin / Institution |
| 1 | 0xCBBF...d8F8 | Paramedic |
| 2 | 0x592b...430F | Physician |
| 3 | 0x3433...1cdc | Insurance Provider |
