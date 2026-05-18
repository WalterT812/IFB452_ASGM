// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AuditLog {

    struct AuditEntry{
    //Audit entry appearance
    address provider;
    string patientID;
    string access; //ACCESS GRANTED/REVOKED
    string dataScope; //TRIAGE/FULL
    uint timeStamp;
    }

    //storage and access control
    address public admin;
    address public emergencyContract; // only EmergencyAccess can write log

    AuditEntry [] public auditLog;

    event LogAdded (address Provider, string patientID, string access, uint timeStamp);
    
    constructor (address _emergencyContract) {
        admin = msg.sender;
        emergencyContract = _emergencyContract;
    }

    modifier onlyEmergencyContract(){
        require(msg.sender == emergencyContract, "Only EmergencyContract can log");
        _;
    }
    modifier onlyAdmin (){
        require (msg.sender == admin, "Only admin can perform this action");
        _;
    }

    //Log Entry
    function addLog (
        address _provider,
        string memory _patientID,
        string memory _access,
        string memory _dataScope
        )public onlyEmergencyContract{
            auditLog.push(AuditEntry(
                _provider,
                _patientID,
                _access,
                _dataScope,
                block.timestamp
            ));

            emit LogAdded (_provider, _patientID, _access, block.timestamp);
        }
    
}