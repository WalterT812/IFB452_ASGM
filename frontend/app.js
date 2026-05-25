// ═══════════════════════════════════════
// MEDLINK — app.js
// ═══════════════════════════════════════

// ── Contract Addresses (fill after Ganache deployment) ──
const CONTRACT_ADDRESSES = {
    emergencyAccess: "0x032499E677E156f6e242d2fFa64A0A7ACa86Db94",
    auditLog: "0x6910EbEC1867fd4139a6e63A9c183C9298FE9f85",
    patientConsent: "0xe85b1A0b28D96c4b07f52C92718BAaC1dA5cAA5f"
};

// ── Contract ABIs (fill after Remix compilation) ──
const EMERGENCY_ACCESS_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_auditLogAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "Provider",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "patientID",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "enum EmergencyAccess.Role",
				"name": "role",
				"type": "uint8"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "startTime",
				"type": "uint256"
			}
		],
		"name": "AccessGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "Provider",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "patientID",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "AccessRevoked",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "provider",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "enum EmergencyAccess.Role",
				"name": "role",
				"type": "uint8"
			}
		],
		"name": "ProviderRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "patientID",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "recordHash",
				"type": "string"
			}
		],
		"name": "RecordSubmitted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "activeSessions",
		"outputs": [
			{
				"internalType": "address",
				"name": "provider",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "patientID",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "startTime",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "auditLogContract",
		"outputs": [
			{
				"internalType": "contract AuditLog",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_patientID",
				"type": "string"
			}
		],
		"name": "getPatientData",
		"outputs": [
			{
				"internalType": "string",
				"name": "dataScope",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "dbReference",
				"type": "string"
			}
		],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "patientRecords",
		"outputs": [
			{
				"internalType": "string",
				"name": "patientID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "recordHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "dbReference",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "exists",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "providers",
		"outputs": [
			{
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			},
			{
				"internalType": "enum EmergencyAccess.Role",
				"name": "role",
				"type": "uint8"
			},
			{
				"internalType": "bool",
				"name": "isRegistered",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_provider",
				"type": "address"
			},
			{
				"internalType": "enum EmergencyAccess.Role",
				"name": "_role",
				"type": "uint8"
			}
		],
		"name": "registerProvider",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_patientID",
				"type": "string"
			}
		],
		"name": "requestEmergencyAccess",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "revokeAccess",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_patientID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_recordHash",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_dbReference",
				"type": "string"
			}
		],
		"name": "submitRecord",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const AUDIT_LOG_ABI = [
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_emergencyContract",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "address",
				"name": "Provider",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "patientID",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "access",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timeStamp",
				"type": "uint256"
			}
		],
		"name": "LogAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_provider",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "_patientID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_access",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_dataScope",
				"type": "string"
			}
		],
		"name": "addLog",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "auditLog",
		"outputs": [
			{
				"internalType": "address",
				"name": "provider",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "patientID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "access",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "dataScope",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "emergencyContract",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getLogCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_index",
				"type": "uint256"
			}
		],
		"name": "getLogEntry",
		"outputs": [
			{
				"internalType": "address",
				"name": "provider",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "PatientID",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "access",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "dataScope",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_patientID",
				"type": "string"
			}
		],
		"name": "getPatientLogs",
		"outputs": [
			{
				"components": [
					{
						"internalType": "address",
						"name": "provider",
						"type": "address"
					},
					{
						"internalType": "string",
						"name": "patientID",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "access",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "dataScope",
						"type": "string"
					},
					{
						"internalType": "uint256",
						"name": "timestamp",
						"type": "uint256"
					}
				],
				"internalType": "struct AuditLog.AuditEntry[]",
				"name": "",
				"type": "tuple[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_newAddress",
				"type": "address"
			}
		],
		"name": "updateEmergencyContact",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

const PATIENT_CONSENT_ABI = [
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "patientID",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "ConsentGranted",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": false,
				"internalType": "string",
				"name": "patientID",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"name": "ConsentRevoked",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "admin",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"name": "consents",
		"outputs": [
			{
				"internalType": "string",
				"name": "patientID",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isActive",
				"type": "bool"
			},
			{
				"internalType": "uint256",
				"name": "grantedAt",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_patientID",
				"type": "string"
			}
		],
		"name": "grantAccess",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_patientID",
				"type": "string"
			}
		],
		"name": "hasConsent",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_patientID",
				"type": "string"
			}
		],
		"name": "revokeConsent",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]

// ── Ganache Test Accounts ──
const ACCOUNTS = {
    admin:     "0xCd1E4A5BB516686A853955d84a9624CbFB6dE4a6",
    paramedic: "0xa691A8DFd20b1C0548089CDC33a6F519cfEab524",
    physician: "0x6b4da01A9E159BCa48f1D7C50e72b1Efe2912BeF",
    insurance: "0x35F57cec1727202429Dd5266f8c1De8697cf97D8"
};

// ── Provider Setup ──
let provider;
let signer;
let emergencyContract;
let auditContract;
let consentContract;
let currentRole;
let timerInterval;

async function initProvider(role) {
    try {
        provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:7545");
        const network = await provider.getNetwork();
        console.log("Connected to network:", network);

        // Select signer based on role
        switch(role) {
            case "admin":
                signer = provider.getSigner(ACCOUNTS.admin);
                break;
            case "paramedic":
                signer = provider.getSigner(ACCOUNTS.paramedic);
                break;
            case "physician":
                signer = provider.getSigner(ACCOUNTS.physician);
                break;
            case "insurance":
                signer = provider.getSigner(ACCOUNTS.insurance);
                break;
            default:
                signer = provider.getSigner(ACCOUNTS.admin);
        }

        // Initialise contracts
        emergencyContract = new ethers.Contract(
            CONTRACT_ADDRESSES.emergencyAccess,
            EMERGENCY_ACCESS_ABI,
            signer
        );

        auditContract = new ethers.Contract(
            CONTRACT_ADDRESSES.auditLog,
            AUDIT_LOG_ABI,
            signer
        );

        consentContract = new ethers.Contract(
            CONTRACT_ADDRESSES.patientConsent,
            PATIENT_CONSENT_ABI,
            signer
        );

        // Display wallet address
        const address = await signer.getAddress();
        const walletEl = document.getElementById("walletAddress");
        if (walletEl) {
            walletEl.textContent = address;
        }

        return true;

    } catch (error) {
        console.error("Connection failed:", error);
        return false;
    }
}

// ═══════════════════════════════════════
// INSTITUTION FUNCTIONS
// ═══════════════════════════════════════

async function registerProvider() {
    const address = document.getElementById("providerAddress").value.trim();
    const role = document.getElementById("providerRole").value;
    const statusEl = document.getElementById("registerStatus");

    if (!address) {
        showStatus(statusEl, "Please enter a provider wallet address.", "error");
        return;
    }

    try {
        showStatus(statusEl, "Registering provider on blockchain...", "success");
        const tx = await emergencyContract.registerProvider(address, role);
        await tx.wait();
        showStatus(statusEl, `✅ Provider registered successfully. TX: ${tx.hash.slice(0,20)}...`, "success");
    } catch (error) {
        showStatus(statusEl, `❌ Error: ${error.message}`, "error");
    }
}

async function submitRecord() {
    const patientID = document.getElementById("submitPatientID").value.trim();
    const recordHash = document.getElementById("recordHash").value.trim();
    const dbReference = document.getElementById("dbReference").value.trim();
    const statusEl = document.getElementById("submitStatus");

    if (!patientID || !recordHash || !dbReference) {
        showStatus(statusEl, "Please fill in all fields and generate hash first.", "error");
        return;
    }

    try {
        showStatus(statusEl, "Submitting record to blockchain...", "success");
        const tx = await emergencyContract.submitRecord(patientID, recordHash, dbReference);
        await tx.wait();

        // Save full patient data to SQLite via API (activated after Node.js setup)
        await savePatientToDatabase({
            patientID,
            name: document.getElementById("patientName").value,
            bloodType: document.getElementById("bloodType").value,
            allergies: document.getElementById("allergies").value,
            medications: document.getElementById("medications").value,
            conditions: document.getElementById("conditions").value,
            dbReference,
            recordHash
        });

        showStatus(statusEl, `✅ Record submitted. TX: ${tx.hash.slice(0,20)}...`, "success");
    } catch (error) {
        showStatus(statusEl, `❌ Error: ${error.message}`, "error");
    }
}

async function savePatientToDatabase(data) {
    try {
        await fetch("http://localhost:3000/api/patient", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    } catch (error) {
        // API not running yet — silently fails until Node.js is set up
        console.log("Database API not connected yet:", error.message);
    }
}

async function grantConsent() {
    const patientID = document.getElementById("consentPatientID").value.trim();
    const statusEl = document.getElementById("consentStatus");

    if (!patientID) {
        showStatus(statusEl, "Please enter a patient ID.", "error");
        return;
    }

    try {
        showStatus(statusEl, "Granting consent on blockchain...", "success");
        const tx = await consentContract.grantAccess(patientID);
        await tx.wait();
        showStatus(statusEl, `✅ Consent granted for ${patientID}.`, "success");
    } catch (error) {
        showStatus(statusEl, `❌ Error: ${error.message}`, "error");
    }
}

async function revokeConsent() {
    const patientID = document.getElementById("consentPatientID").value.trim();
    const statusEl = document.getElementById("consentStatus");

    if (!patientID) {
        showStatus(statusEl, "Please enter a patient ID.", "error");
        return;
    }

    try {
        showStatus(statusEl, "Revoking consent on blockchain...", "success");
        const tx = await consentContract.revokeConsent(patientID);
        await tx.wait();
        showStatus(statusEl, `✅ Consent revoked for ${patientID}.`, "success");
    } catch (error) {
        showStatus(statusEl, `❌ Error: ${error.message}`, "error");
    }
}

async function checkConsent() {
    const patientID = document.getElementById("checkConsentPatientID").value.trim();
    const statusEl = document.getElementById("checkConsentStatus");

    if (!patientID) {
        showStatus(statusEl, "Please enter a patient ID.", "error");
        return;
    }

    try {
        const hasConsent = await consentContract.hasConsent(patientID);
        if (hasConsent) {
            showStatus(statusEl, `✅ ${patientID} has active insurance consent.`, "success");
        } else {
            showStatus(statusEl, `⛔ ${patientID} has no active insurance consent.`, "error");
        }
    } catch (error) {
        showStatus(statusEl, `❌ Error: ${error.message}`, "error");
    }
}

// ═══════════════════════════════════════
// PROVIDER FUNCTIONS
// ═══════════════════════════════════════

async function requestAccess() {
    const patientID = document.getElementById("patientID").value.trim();
    const statusEl = document.getElementById("accessStatus");

    if (!patientID) {
        showStatus(statusEl, "Please enter a patient ID.", "error");
        return;
    }

    try {
        showStatus(statusEl, "Requesting emergency access...", "success");
        const tx = await emergencyContract.requestEmergencyAccess(patientID);
        await tx.wait();
        showStatus(statusEl, `✅ Access granted. Fetching records...`, "success");

        // Fetch patient data
        await fetchPatientData(patientID);

        // Show revoke button
        document.getElementById("revokeBtn").style.display = "block";

        // Start 15 min timer
        startTimer();

    } catch (error) {
        showStatus(statusEl, `❌ Error: ${error.message}`, "error");
    }
}

async function fetchPatientData(patientID) {
    try {
        const result = await emergencyContract.getPatientData(patientID);
        const dataScope = result[0];
        const dbReference = result[1];

        // Fetch actual record from SQLite based on scope
        const endpoint = dataScope === "TRIAGE"
            ? `http://localhost:3000/api/patient/triage/${dbReference}`
            : `http://localhost:3000/api/patient/full/${dbReference}`;

        const response = await fetch(endpoint);
        const record = await response.json();

        if (record.error) {
            displayPatientData(patientID, dataScope, dbReference);
        } else {
            displayRealPatientData(patientID, dataScope, record.data);
        }

    } catch (error) {
        console.error("Failed to fetch patient data:", error);
    }
}

function displayPatientData(patientID, dataScope, dbReference) {
    const dataDisplay = document.getElementById("dataDisplay");
    const scopeBadge = document.getElementById("scopeBadge");
    const dataRows = document.getElementById("patientDataRows");

    // Set scope badge
    if (dataScope === "TRIAGE") {
        scopeBadge.innerHTML = `<span class="data-scope-badge scope-triage">TRIAGE — Paramedic Access</span>`;
        dataRows.innerHTML = `
            <div class="data-row">
                <span class="data-label">Patient ID</span>
                <span class="data-value">${patientID}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Blood Type</span>
                <span class="data-value">Retrieved from: ${dbReference}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Known Allergies</span>
                <span class="data-value">Retrieved from: ${dbReference}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Active Medications</span>
                <span class="data-value">Retrieved from: ${dbReference}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Critical Conditions</span>
                <span class="data-value">Retrieved from: ${dbReference}</span>
            </div>
        `;
    } else {
        scopeBadge.innerHTML = `<span class="data-scope-badge scope-full">FULL HISTORY — Physician Access</span>`;
        dataRows.innerHTML = `
            <div class="data-row">
                <span class="data-label">Patient ID</span>
                <span class="data-value">${patientID}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Full Record</span>
                <span class="data-value">Retrieved from: ${dbReference}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Medical History</span>
                <span class="data-value">Retrieved from: ${dbReference}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Past Diagnoses</span>
                <span class="data-value">Retrieved from: ${dbReference}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Lab Results</span>
                <span class="data-value">Retrieved from: ${dbReference}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Referral History</span>
                <span class="data-value">Retrieved from: ${dbReference}</span>
            </div>
        `;
    }

    dataDisplay.style.display = "block";
}

async function revokeAccess() {
    const statusEl = document.getElementById("accessStatus");

    try {
        const tx = await emergencyContract.revokeAccess();
        await tx.wait();
        showStatus(statusEl, "✅ Access revoked successfully.", "success");

        // Hide data and timer
        document.getElementById("dataDisplay").style.display = "none";
        document.getElementById("timerBar").style.display = "none";
        document.getElementById("revokeBtn").style.display = "none";
        clearInterval(timerInterval);

    } catch (error) {
        showStatus(statusEl, `❌ Error: ${error.message}`, "error");
    }
}

// ═══════════════════════════════════════
// AUDIT LOG FUNCTIONS
// ═══════════════════════════════════════

async function fetchAuditLog() {
    const patientID = document.getElementById("searchPatientID").value.trim();
    const statusEl = document.getElementById("searchStatus");
    const logContainer = document.getElementById("logContainer");
    const logEntries = document.getElementById("logEntries");
    const logCount = document.getElementById("logCount");

    if (!patientID) {
        showStatus(statusEl, "Please enter a patient ID.", "error");
        return;
    }

    try {
        showStatus(statusEl, "Fetching audit log from blockchain...", "success");
        const logs = await auditContract.getPatientLogs(patientID);

        if (logs.length === 0) {
            logEntries.innerHTML = `<div class="empty-state">No access events found for ${patientID}</div>`;
        } else {
            logCount.textContent = `${logs.length} event${logs.length > 1 ? 's' : ''} found`;
            logEntries.innerHTML = logs.map((log, i) => {
                const date = new Date(log.timestamp * 1000).toLocaleString();
                const actionClass = getActionClass(log.access);
                const scopeClass = getScopeClass(log.dataScope);

                return `
                    <div class="log-entry">
                        <div class="log-entry-header">
                            <span class="action-badge ${actionClass}">${log.access}</span>
                            <span class="log-timestamp">${date}</span>
                        </div>
                        <div class="log-details">
                            <div class="log-detail-item">
                                <div class="log-detail-label">Provider</div>
                                <div class="log-detail-value">${log.provider}</div>
                            </div>
                            <div class="log-detail-item">
                                <div class="log-detail-label">Data Scope</div>
                                <div class="log-detail-value">
                                    <span class="scope-pill ${scopeClass}">${log.dataScope || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        statusEl.style.display = "none";
        logContainer.style.display = "block";

    } catch (error) {
        showStatus(statusEl, `❌ Error: ${error.message}`, "error");
    }
}

function displayRealPatientData(patientID, dataScope, data) {
    const dataDisplay = document.getElementById("dataDisplay");
    const scopeBadge = document.getElementById("scopeBadge");
    const dataRows = document.getElementById("patientDataRows");

    if (dataScope === "TRIAGE") {
        scopeBadge.innerHTML = `<span class="data-scope-badge scope-triage">TRIAGE — Paramedic Access</span>`;
        dataRows.innerHTML = `
            <div class="data-row">
                <span class="data-label">Patient ID</span>
                <span class="data-value">${data.patientID}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Blood Type</span>
                <span class="data-value">${data.bloodType || 'Not recorded'}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Known Allergies</span>
                <span class="data-value">${data.allergies || 'None recorded'}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Active Medications</span>
                <span class="data-value">${data.medications || 'None recorded'}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Critical Conditions</span>
                <span class="data-value">${data.conditions || 'None recorded'}</span>
            </div>
        `;
    } else {
        scopeBadge.innerHTML = `<span class="data-scope-badge scope-full">FULL HISTORY — Physician Access</span>`;
        dataRows.innerHTML = `
            <div class="data-row">
                <span class="data-label">Patient ID</span>
                <span class="data-value">${data.patientID}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Full Name</span>
                <span class="data-value">${data.name || 'Not recorded'}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Blood Type</span>
                <span class="data-value">${data.bloodType || 'Not recorded'}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Known Allergies</span>
                <span class="data-value">${data.allergies || 'None recorded'}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Active Medications</span>
                <span class="data-value">${data.medications || 'None recorded'}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Critical Conditions</span>
                <span class="data-value">${data.conditions || 'None recorded'}</span>
            </div>
            <div class="data-row">
                <span class="data-label">Record Created</span>
                <span class="data-value">${data.createdAt || 'Unknown'}</span>
            </div>
        `;
    }

    dataDisplay.style.display = "block";
}

// ═══════════════════════════════════════
// TIMER
// ═══════════════════════════════════════

function startTimer() {
    const timerBar = document.getElementById("timerBar");
    const timerCountdown = document.getElementById("timerCountdown");
    const timerFill = document.getElementById("timerFill");

    timerBar.style.display = "block";

    const totalSeconds = 15 * 60;
    let remaining = totalSeconds;

    timerInterval = setInterval(() => {
        remaining--;

        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        timerCountdown.textContent = `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`;

        const pct = (remaining / totalSeconds) * 100;
        timerFill.style.width = `${pct}%`;

        // Turn red when under 2 minutes
        if (remaining <= 120) {
            timerCountdown.style.color = "#ef4444";
            timerFill.style.background = "#ef4444";
        }

        if (remaining <= 0) {
            clearInterval(timerInterval);
            timerCountdown.textContent = "00:00";
            document.getElementById("dataDisplay").style.display = "none";
            document.getElementById("revokeBtn").style.display = "none";
            showStatus(
                document.getElementById("accessStatus"),
                "⏱ Access window expired. Session automatically revoked.",
                "error"
            );
        }
    }, 1000);
}

// ═══════════════════════════════════════
// AUTO-GENERATE HASH AND DB REFERENCE
// ═══════════════════════════════════════

function generateRecordFields() {
    const patientID = document.getElementById("submitPatientID").value.trim();
    const name = document.getElementById("patientName").value.trim();
    const bloodType = document.getElementById("bloodType").value;
    const allergies = document.getElementById("allergies").value.trim();
    const medications = document.getElementById("medications").value.trim();
    const conditions = document.getElementById("conditions").value.trim();

    if (!patientID) {
        alert("Please enter a Patient ID first.");
        return;
    }

    // Generate DB reference from patientID + timestamp
    const timestamp = Date.now();
    const dbRef = `${patientID}_${timestamp}`;
    document.getElementById("dbReference").value = dbRef;

    // Generate record hash from all fields combined
    const rawData = `${patientID}|${name}|${bloodType}|${allergies}|${medications}|${conditions}|${timestamp}`;
    const hash = ethers.utils.id(rawData); // keccak256 via ethers.js
    document.getElementById("recordHash").value = hash;
}

// ═══════════════════════════════════════
// VIEW PATIENT RECORD
// ═══════════════════════════════════════

async function viewPatientRecord() {
    const patientID = document.getElementById("viewPatientID").value.trim();
    const statusEl = document.getElementById("viewStatus");
    const display = document.getElementById("viewRecordDisplay");

    if (!patientID) {
        showStatus(statusEl, "Please enter a patient ID.", "error");
        return;
    }

    try {
        showStatus(statusEl, "Fetching from blockchain...", "success");

        const record = await emergencyContract.patientRecords(patientID);

        if (!record.exists) {
            showStatus(statusEl, `⛔ No record found for ${patientID}.`, "error");
            display.style.display = "none";
            return;
        }

        document.getElementById("view_patientID").textContent = record.patientID;
        document.getElementById("view_recordHash").textContent = record.recordHash;
        document.getElementById("view_dbReference").textContent = record.dbReference;

        statusEl.style.display = "none";
        display.style.display = "block";

    } catch (error) {
        showStatus(statusEl, `❌ Error: ${error.message}`, "error");
    }
}

// ═══════════════════════════════════════
// ROLE BANNER (provider.html)
// ═══════════════════════════════════════

function initRoleBanner() {
    const params = new URLSearchParams(window.location.search);
    const role = params.get("role");
    currentRole = role;

    const banner = document.getElementById("roleBanner");
    const icon = document.getElementById("roleIcon");
    const title = document.getElementById("roleTitle");
    const desc = document.getElementById("roleDesc");

    if (role === "paramedic") {
        banner.classList.add("paramedic");
        icon.textContent = "🚑";
        title.textContent = "Paramedic Access";
        desc.textContent = "Triage-critical data only — blood type, allergies, active medications, critical conditions";
        initProvider("paramedic");
    } else {
        banner.classList.add("physician");
        icon.textContent = "👨‍⚕️";
        title.textContent = "Physician Access";
        desc.textContent = "Full medical history — diagnoses, lab results, referral history, medications";
        initProvider("physician");
    }
}

// ═══════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════

function showStatus(el, message, type) {
    el.textContent = message;
    el.className = `status-box status-${type}`;
    el.style.display = "block";
}

function getActionClass(action) {
    switch(action) {
        case "ACCESS_GRANTED": return "action-granted";
        case "DATA_ACCESSED": return "action-accessed";
        case "ACCESS_REVOKED": return "action-revoked";
        default: return "action-pending";
    }
}

function getScopeClass(scope) {
    switch(scope) {
        case "TRIAGE": return "scope-triage";
        case "FULL": return "scope-full";
        default: return "scope-pending";
    }
}

// ═══════════════════════════════════════
// PAGE INIT
// ═══════════════════════════════════════

window.addEventListener("load", () => {
    const page = window.location.pathname;

    if (page.includes("institution")) {
        initProvider("admin");
    } else if (page.includes("provider")) {
        initRoleBanner();
    } else if (page.includes("audit")) {
        initProvider("admin");
    }
});