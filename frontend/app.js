// ═══════════════════════════════════════
// MEDLINK — app.js
// ═══════════════════════════════════════

// ── Contract Addresses (fill after Ganache deployment) ──
const CONTRACT_ADDRESSES = {
    emergencyAccess: "EMERGENCY_ACCESS_ADDRESS_HERE",
    auditLog: "AUDIT_LOG_ADDRESS_HERE",
    patientConsent: "PATIENT_CONSENT_ADDRESS_HERE"
};

// ── Contract ABIs (fill after Remix compilation) ──
const EMERGENCY_ACCESS_ABI = [
    "function registerProvider(address _provider, uint8 _role) public",
    "function submitRecord(string memory _patientID, string memory _recordHash, string memory _dbReference) public",
    "function requestEmergencyAccess(string memory _patientID) public",
    "function getPatientData(string memory _patientID) public returns (string memory dataScope, string memory dbReference)",
    "function revokeAccess() public",
    "function providers(address) public view returns (address wallet, uint8 role, bool isRegistered)",
    "function activeSessions(address) public view returns (address provider, string memory patientID, uint256 startTime, bool isActive)",
    "event AccessGranted(address provider, string patientID, uint8 role, uint256 timestamp)",
    "event AccessRevoked(address provider, string patientID, uint256 timestamp)"
];

const AUDIT_LOG_ABI = [
    "function getLogCount() public view returns (uint256)",
    "function getLogEntry(uint256 _index) public view returns (address provider, string memory patientID, string memory access, string memory dataScope, uint256 timestamp)",
    "function getPatientLogs(string memory _patientID) public view returns (tuple(address provider, string patientID, string access, string dataScope, uint256 timestamp)[])",
    "event LogAdded(address provider, string patientID, string access, uint256 timestamp)"
];

const PATIENT_CONSENT_ABI = [
    "function grantAccess(string memory _patientID) public",
    "function revokeConsent(string memory _patientID) public",
    "function hasConsent(string memory _patientID) public view returns (bool)",
    "event ConsentGranted(string patientID, uint256 timestamp)",
    "event ConsentRevoked(string patientID, uint256 timestamp)"
];

// ── Ganache Test Accounts ──
const ACCOUNTS = {
    admin:     "0x05608c92B0E376C51c5e813B5E48f845260c7c61",
    paramedic: "0xCBBF4E44329d56C56d04CA2285EC3cd8f046d8F8",
    physician: "0x592b1792D0F3FBD1d1c332d1Caf8750a434F430F",
    insurance: "0x3433eBb993892263f9E7aE3c139b7763Ce5C1cdc"
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
        showStatus(statusEl, "Please fill in all fields.", "error");
        return;
    }

    try {
        showStatus(statusEl, "Submitting record to blockchain...", "success");
        const tx = await emergencyContract.submitRecord(patientID, recordHash, dbReference);
        await tx.wait();
        showStatus(statusEl, `✅ Record submitted. TX: ${tx.hash.slice(0,20)}...`, "success");
    } catch (error) {
        showStatus(statusEl, `❌ Error: ${error.message}`, "error");
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

        displayPatientData(patientID, dataScope, dbReference);

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