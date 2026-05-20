// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract PatientConsent{

    //Consent Entry for insurance acccess
    struct ConsentEntry{
        string patientID;
        bool isActive;
        uint256 grantedAt;
    }

    address public admin;

    //patientID ==> consent status
    mapping(string => ConsentEntry) public consents;

    event ConsentGranted(string patientID, uint256 timestamp);
    event ConsentRevoked(string patientID, uint256 timestamp);

    constructor(){
        admin = msg.sender;
    }

    modifier onlyAdmin(){
        require (msg.sender == admin, "Only admin can perform ");
        _;
    }

    //patient grants consent access
    function grantAccess(string memory _patientID) public onlyAdmin{
        consents[_patientID] = ConsentEntry(
            _patientID,
            true,
            block.timestamp
        );
        emit ConsentGranted(_patientID, block.timestamp);
    }

    //Patient revokes insurance access
    function revokeConsent(string memory _patientID) public onlyAdmin{
        require(consents[_patientID].isActive,"No active consent found");
        consents[_patientID].isActive = false;
        emit ConsentRevoked(_patientID, block.timestamp);
    }

    //checking if patient has active consent
    function hasConsent(string memory _patientID) public view returns (bool){
        return consents[_patientID].isActive;
    }

}