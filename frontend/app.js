// ═══════════════════════════════════════
// MEDLINK — app.js
// ═══════════════════════════════════════

// ── Contract Addresses (fill after Ganache deployment) ──
const CONTRACT_ADDRESSES = {
    emergencyAccess: "0x81a3a5940Ec3605034CB9620Be9B1CdA6D45cC85",
    auditLog: "0xAeD3674BFAE41C31E5DBc531A11C4A47181f6bFF",
    patientConsent: "0x99EC0FB9eaE3F8B40AFc078e0cdd4Cb62A5483E7"
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

async function loadOptionalPrivateConfig() {
    try {
        const res = await fetch("config.private.js", { cache: "no-store" });
        if (!res.ok) return false;

        const js = await res.text();
        const parsed = new Function(
            `${js}\nreturn {\n` +
            `  accounts: typeof LOCAL_ACCOUNTS !== "undefined" ? LOCAL_ACCOUNTS : null,\n` +
            `  contracts: typeof LOCAL_CONTRACT_ADDRESSES !== "undefined" ? LOCAL_CONTRACT_ADDRESSES : null\n` +
            `};`
        )();

        if (parsed.accounts) Object.assign(ACCOUNTS, parsed.accounts);
        if (parsed.contracts) Object.assign(CONTRACT_ADDRESSES, parsed.contracts);
        return true;
    } catch (_) {
        return false;
    }
}

// ── Provider Setup ──
let provider;
let signer;
let emergencyContract;
let auditContract;
let consentContract;
let currentRole;
let timerInterval;
const SESSION_DURATION_SEC = 15 * 60;

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
            const ganacheAccounts = await provider.listAccounts();
            const known = ganacheAccounts.map((a) => a.toLowerCase()).includes(address.toLowerCase());
            walletEl.textContent = address;
            walletEl.title = known
                ? ""
                : "This address is not in the current Ganache account list; transactions may fail.";
            if (!known) {
                walletEl.style.color = "#f87171";
            }
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
        showErrorStatus(statusEl, error);
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
        const saved = await savePatientToDatabase({
            patientID,
            name: document.getElementById("patientName").value,
            bloodType: document.getElementById("bloodType").value,
            allergies: document.getElementById("allergies").value,
            medications: document.getElementById("medications").value,
            conditions: document.getElementById("conditions").value,
            dbReference,
            recordHash
        });

        if (saved) {
            showStatus(statusEl, `✅ Record submitted. TX: ${tx.hash.slice(0,20)}...`, "success");
        } else {
            showStatus(
                statusEl,
                `✅ On-chain record submitted. Start the API (npm start) and submit again to sync SQLite.`,
                "success"
            );
        }
    } catch (error) {
        showErrorStatus(statusEl, error);
    }
}

async function savePatientToDatabase(data) {
    try {
        const response = await fetch("http://localhost:3000/api/patient", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            console.warn("API save failed:", body.error || response.status);
            return false;
        }
        return true;
    } catch (error) {
        console.warn("Database API not connected:", error.message);
        return false;
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
        showErrorStatus(statusEl, error);
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
        showErrorStatus(statusEl, error);
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
        showErrorStatus(statusEl, error);
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
        const existing = await readActiveSession();
        if (existing) {
            await showActiveSession(existing.patientID, existing.startTime);
            return;
        }

        showStatus(statusEl, "Requesting emergency access...", "success");
        const tx = await emergencyContract.requestEmergencyAccess(patientID);
        await tx.wait();

        const session = await readActiveSession();
        await showActiveSession(patientID, session?.startTime);
        showStatus(statusEl, "Access granted.", "success");

    } catch (error) {
        const msg = error?.message || "";
        if (msg.includes("Active session already exists")) {
            const restored = await restoreActiveSession();
            if (restored) return;
        }
        showErrorStatus(statusEl, error);
    }
}

async function readActiveSession() {
    if (!emergencyContract || !signer) return null;

    const address = await signer.getAddress();
    const raw = await emergencyContract.activeSessions(address);
    const isActive = raw.isActive ?? raw[3];
    if (!isActive) return null;

    const startTime = raw.startTime ?? raw[2];
    return {
        isActive: true,
        patientID: raw.patientID ?? raw[1],
        startTime: ethers.BigNumber.isBigNumber(startTime) ? startTime.toNumber() : Number(startTime)
    };
}

function getSessionRemainingSeconds(startTimeSec) {
    const now = Math.floor(Date.now() / 1000);
    return SESSION_DURATION_SEC - (now - startTimeSec);
}

async function showActiveSession(patientID, startTimeSec) {
    const statusEl = document.getElementById("accessStatus");
    const patientInput = document.getElementById("patientID");
    if (patientInput) patientInput.value = patientID;

    const remaining =
        startTimeSec != null ? getSessionRemainingSeconds(startTimeSec) : SESSION_DURATION_SEC;

    document.getElementById("revokeBtn").style.display = "block";

    if (remaining <= 0) {
        showStatus(
            statusEl,
            "Access window expired. Click Revoke Access to end this session before requesting again.",
            "error"
        );
        startTimer(startTimeSec);
        return;
    }

    showStatus(statusEl, "Restoring active session...", "success");
    await fetchPatientData(patientID);
    startTimer(startTimeSec);
    showStatus(statusEl, "Active session restored.", "success");
}

async function restoreActiveSession() {
    try {
        const session = await readActiveSession();
        if (!session) return false;
        await showActiveSession(session.patientID, session.startTime);
        return true;
    } catch (error) {
        console.error("Failed to restore session:", error);
        return false;
    }
}

async function fetchPatientRecordFromApi(patientID, dataScope, dbReference) {
    const scopePath = isTriageScope(dataScope) ? "triage" : "full";

    const fetchByReference = async (ref) => {
        const url = `http://localhost:3000/api/patient/${scopePath}/${encodeURIComponent(ref)}`;
        const response = await fetch(url);
        const body = await response.json().catch(() => ({}));
        return { response, body };
    };

    let { response, body } = await fetchByReference(dbReference);
    if (response.ok && body.data && !body.error) {
        return body.data;
    }

    const idRes = await fetch(
        `http://localhost:3000/api/patient/id/${encodeURIComponent(patientID)}`
    );
    const idBody = await idRes.json().catch(() => ({}));

    if (idRes.ok && idBody.data) {
        if (idBody.data.dbReference && idBody.data.dbReference !== dbReference) {
            ({ response, body } = await fetchByReference(idBody.data.dbReference));
            if (response.ok && body.data && !body.error) {
                return body.data;
            }
        }
        return idBody.data;
    }

    return null;
}

async function fetchPatientData(patientID) {
    const statusEl = document.getElementById("accessStatus");

    try {
        const result = await emergencyContract.callStatic.getPatientData(patientID);
        const dataScope = result.dataScope ?? result[0];
        const dbReference = result.dbReference ?? result[1];

        const record = await fetchPatientRecordFromApi(patientID, dataScope, dbReference);

        if (record) {
            displayRealPatientData(patientID, dataScope, record);
        } else {
            displayPatientData(patientID, dataScope, dbReference);
            if (statusEl) {
                showStatus(
                    statusEl,
                    "On-chain access OK, but no matching record in the local database. Run npm start and re-submit the patient from Institution.",
                    "error"
                );
            }
        }
    } catch (error) {
        console.error("Failed to fetch patient data:", error);
        if (statusEl) {
            showErrorStatus(statusEl, error);
        }
    }
}

function displayPatientData(patientID, dataScope, dbReference) {
    const dataDisplay = document.getElementById("dataDisplay");
    const scopeBadge = document.getElementById("scopeBadge");
    const dataRows = document.getElementById("patientDataRows");

    // Set scope badge
    if (isTriageScope(dataScope)) {
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
        showErrorStatus(statusEl, error);
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
        showErrorStatus(statusEl, error);
    }
}

function displayRealPatientData(patientID, dataScope, data) {
    const dataDisplay = document.getElementById("dataDisplay");
    const scopeBadge = document.getElementById("scopeBadge");
    const dataRows = document.getElementById("patientDataRows");

    if (isTriageScope(dataScope)) {
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

function startTimer(startTimeSec) {
    const timerBar = document.getElementById("timerBar");
    const timerCountdown = document.getElementById("timerCountdown");
    const timerFill = document.getElementById("timerFill");

    clearInterval(timerInterval);
    timerBar.style.display = "block";
    timerCountdown.style.color = "";
    timerFill.style.background = "";

    const totalSeconds = SESSION_DURATION_SEC;
    const sessionStart = startTimeSec != null ? startTimeSec : Math.floor(Date.now() / 1000);

    function tick() {
        const remaining = Math.max(0, getSessionRemainingSeconds(sessionStart));

        const mins = Math.floor(remaining / 60);
        const secs = remaining % 60;
        timerCountdown.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;

        const pct = (remaining / totalSeconds) * 100;
        timerFill.style.width = `${pct}%`;

        if (remaining <= 120 && remaining > 0) {
            timerCountdown.style.color = "#ef4444";
            timerFill.style.background = "#ef4444";
        }

        if (remaining <= 0) {
            clearInterval(timerInterval);
            timerCountdown.textContent = "00:00";
            document.getElementById("dataDisplay").style.display = "none";
            showStatus(
                document.getElementById("accessStatus"),
                "Access window expired. Click Revoke Access to end this session.",
                "error"
            );
        }
    }

    tick();
    timerInterval = setInterval(tick, 1000);
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
        showErrorStatus(statusEl, error);
    }
}

// ═══════════════════════════════════════
// ROLE BANNER (provider.html)
// ═══════════════════════════════════════

function getProviderRoleFromPage() {
    if (window.MEDLINK_PROVIDER_ROLE === "paramedic" || window.MEDLINK_PROVIDER_ROLE === "physician") {
        return window.MEDLINK_PROVIDER_ROLE;
    }
    const queryRole = new URLSearchParams(window.location.search).get("role");
    if (queryRole === "paramedic" || queryRole === "physician") {
        return queryRole;
    }
    const path = window.location.pathname.toLowerCase();
    if (path.includes("paramedic")) return "paramedic";
    if (path.includes("physician")) return "physician";
    return null;
}

async function initRoleBanner() {
    const role = getProviderRoleFromPage();
    currentRole = role;

    const banner = document.getElementById("roleBanner");
    const icon = document.getElementById("roleIcon");
    const title = document.getElementById("roleTitle");
    const desc = document.getElementById("roleDesc");
    const statusEl = document.getElementById("accessStatus");

    banner.classList.remove("paramedic", "physician");

    if (role !== "paramedic" && role !== "physician") {
        title.textContent = "Provider Access";
        desc.textContent = "Open Paramedic or Physician from the home page.";
        showStatus(statusEl, "Role not specified. Go back and choose Paramedic or Physician.", "error");
        return;
    }

    if (role === "paramedic") {
        banner.classList.add("paramedic");
        icon.textContent = "🚑";
        title.textContent = "Paramedic Access";
        desc.textContent = "Triage-critical data only — blood type, allergies, active medications, critical conditions";
        await initProvider("paramedic");
    } else {
        banner.classList.add("physician");
        icon.textContent = "👨‍⚕️";
        title.textContent = "Physician Access";
        desc.textContent = "Full medical history — diagnoses, lab results, referral history, medications";
        await initProvider("physician");
    }

    await restoreActiveSession();
}

// ═══════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════

function showStatus(el, message, type) {
    el.textContent = message;
    el.className = `status-box status-${type}`;
    el.style.display = "block";
}

function showErrorStatus(el, error) {
    showStatus(el, `❌ ${formatBlockchainError(error)}`, "error");
}

function formatBlockchainError(error) {
    const nested =
        error?.error?.message ||
        error?.data?.message ||
        error?.reason ||
        error?.message ||
        String(error);

    let msg = typeof nested === "string" ? nested : String(nested);

    if (msg.includes("sender account not recognized")) {
        return (
            "Ganache does not recognise this wallet address. Check that: (1) Ganache is running your IFB452 workspace; " +
            "(2) frontend/config.private.js exists (copy from config.private.example.js) with your accounts and contract addresses; " +
            "(3) hard-refresh the page (Ctrl+Shift+R)."
        );
    }
    if (msg.includes("Active session already exists")) {
        return "An active emergency session already exists. The page should restore it automatically; refresh or click Request Access again.";
    }
    if (msg.includes("Provider not registered")) {
        return "This wallet is not registered on-chain. Register the paramedic/physician address on the Institution page (admin account) first.";
    }
    if (msg.includes("execution reverted")) {
        const revert = msg.match(/reverted:?\s*([^"]+)/i);
        if (revert) return `Transaction reverted: ${revert[1].trim()}`;
    }

    if (msg.length > 180) {
        const quoted = msg.match(/"message"\s*:\s*"([^"]+)"/);
        if (quoted) return quoted[1];
        if (msg.includes("{")) return "Blockchain request failed. Open the browser console (F12) for details.";
    }

    return msg;
}

function getActionClass(action) {
    switch(action) {
        case "ACCESS_GRANTED": return "action-granted";
        case "DATA_ACCESSED": return "action-accessed";
        case "ACCESS_REVOKED": return "action-revoked";
        default: return "action-pending";
    }
}

function isTriageScope(dataScope) {
    return dataScope === "TRIAGE" || dataScope === "Triage";
}

function getScopeClass(scope) {
    if (isTriageScope(scope)) return "scope-triage";
    if (scope === "FULL") return "scope-full";
    return "scope-pending";
}

// ═══════════════════════════════════════
// PAGE INIT
// ═══════════════════════════════════════

window.addEventListener("load", async () => {
    await loadOptionalPrivateConfig();

    const page = window.location.pathname;

    if (page.includes("institution")) {
        await initProvider("admin");
    } else if (
        page.includes("provider") ||
        page.includes("paramedic") ||
        page.includes("physician")
    ) {
        await initRoleBanner();
    } else if (page.includes("audit")) {
        await initProvider("admin");
    }
});