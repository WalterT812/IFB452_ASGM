// ═══════════════════════════════════════
// MEDLINK — server.js
// Node.js API + SQLite Database
// ═══════════════════════════════════════

const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
const PORT = 3000;

// ── Middleware ──
app.use(cors());
app.use(express.json());

// ── Database Setup ──
const db = new Database("medlink.db");

// Create tables if they don't exist
db.exec(`
    CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patientID TEXT UNIQUE NOT NULL,
        name TEXT,
        bloodType TEXT,
        allergies TEXT,
        medications TEXT,
        conditions TEXT,
        dbReference TEXT UNIQUE NOT NULL,
        recordHash TEXT NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS triage_view (
        patientID TEXT PRIMARY KEY,
        bloodType TEXT,
        allergies TEXT,
        medications TEXT,
        conditions TEXT
    );
`);

console.log("✅ Database initialised");

// ═══════════════════════════════════════
// ROUTES
// ═══════════════════════════════════════

// POST /api/patient — save patient record
app.post("/api/patient", (req, res) => {
    const {
        patientID,
        name,
        bloodType,
        allergies,
        medications,
        conditions,
        dbReference,
        recordHash
    } = req.body;

    if (!patientID || !dbReference || !recordHash) {
        return res.status(400).json({ error: "Missing required fields" });
    }

    try {
        // Insert into main patients table
        const insertPatient = db.prepare(`
            INSERT OR REPLACE INTO patients 
            (patientID, name, bloodType, allergies, medications, conditions, dbReference, recordHash)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);

        insertPatient.run(
            patientID, name, bloodType,
            allergies, medications, conditions,
            dbReference, recordHash
        );

        // Insert into triage view (critical fields only)
        const insertTriage = db.prepare(`
            INSERT OR REPLACE INTO triage_view
            (patientID, bloodType, allergies, medications, conditions)
            VALUES (?, ?, ?, ?, ?)
        `);

        insertTriage.run(patientID, bloodType, allergies, medications, conditions);

        console.log(`✅ Patient record saved: ${patientID}`);
        res.json({ success: true, message: `Record saved for ${patientID}` });

    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: error.message });
    }
});

// GET /api/patient/triage/:dbReference — paramedic scope
app.get("/api/patient/triage/:dbReference", (req, res) => {
    const { dbReference } = req.params;

    try {
        const patient = db.prepare(`
            SELECT p.patientID, t.bloodType, t.allergies, t.medications, t.conditions
            FROM patients p
            JOIN triage_view t ON p.patientID = t.patientID
            WHERE p.dbReference = ?
        `).get(dbReference);

        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        res.json({
            scope: "TRIAGE",
            data: patient
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/patient/full/:dbReference — physician scope
app.get("/api/patient/full/:dbReference", (req, res) => {
    const { dbReference } = req.params;

    try {
        const patient = db.prepare(`
            SELECT * FROM patients WHERE dbReference = ?
        `).get(dbReference);

        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        res.json({
            scope: "FULL",
            data: patient
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/patient/:patientID — check if patient exists
app.get("/api/patient/:patientID", (req, res) => {
    const { patientID } = req.params;

    try {
        const patient = db.prepare(`
            SELECT patientID, name, bloodType, dbReference FROM patients WHERE patientID = ?
        `).get(patientID);

        if (!patient) {
            return res.status(404).json({ error: "Patient not found" });
        }

        res.json({ exists: true, data: patient });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ── Start Server ──
app.listen(PORT, () => {
    console.log(`🚀 MedLink API running at http://localhost:${PORT}`);
});