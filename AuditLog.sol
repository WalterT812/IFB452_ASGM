// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AuditLog {

    struct AuditEntry{
    //Audit entry appearance
    address provider;
    string patientID;
    string access; //ACCESS GRANTED/REVOKED
    string dataScope; //TRIAGE/FULL
    uint timestamp;
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
    
    //Getting log

    //fetching log numbers
    function getLogCount() public view returns (uint256){
        return auditLog.length;
    }

    function getLogEntry(uint256 _index) public view returns(
        address provider,
        string memory PatientID,
        string memory access,
        string memory dataScope,
        uint256 timestamp
    ){
        require(_index < auditLog.length, "Index out of bounds");
        AuditEntry memory entry = auditLog[_index];
        return(
            entry.provider,
            entry.patientID,
            entry.access,
            entry.dataScope,
            entry.timestamp
        );
    }

    //Get all logs for patient
    function getPatientLogs(string memory _patientID) public view returns (AuditEntry[]memory){
        uint256 count = 0;

        //counting matching entries
        for (uint256 i = 0; i<auditLog.length; i++){
            if (keccak256(bytes(auditLog[i].patientID)) == keccak256(bytes(_patientID))){
                count ++;
            }
        }

        //collecting matching entries
        AuditEntry[] memory result = new AuditEntry[](count);
        uint256 index = 0;
        for (uint256 i = 0; i< auditLog.length; i++){
            if (keccak256(bytes(auditLog[i].patientID)) == keccak256(bytes(_patientID))){
                result[index] = auditLog[i];
                index ++;
            }
        }

        return result ;
    }

    //update auditlog with new address
    function updateEmergencyContact(address _newAddress) public onlyAdmin{
        emergencyContract = _newAddress;
    }
}
