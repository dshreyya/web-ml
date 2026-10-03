// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract BlueCarbonRegistry is AccessControl {
    bytes32 public constant VERIFIER_ROLE = keccak256("VERIFIER_ROLE");

    struct ReportProof {
        bytes32 reportHash;
        string reportId;
        string projectId;
        uint256 anchoredAt;
        address anchoredBy;
    }

    mapping(string => ReportProof) public reports;

    event ReportAnchored(
        string indexed reportId,
        string projectId,
        bytes32 reportHash,
        uint256 anchoredAt,
        address anchoredBy
    );

    constructor(address initialAdmin) {
        _grantRole(DEFAULT_ADMIN_ROLE, initialAdmin);
        _grantRole(VERIFIER_ROLE, initialAdmin);
    }

    function anchorReport(
        string calldata reportId,
        string calldata projectId,
        bytes32 reportHash
    ) external onlyRole(VERIFIER_ROLE) {
        require(
            reports[reportId].anchoredAt == 0,
            "Report already anchored"
        );

        reports[reportId] = ReportProof({
            reportHash: reportHash,
            reportId: reportId,
            projectId: projectId,
            anchoredAt: block.timestamp,
            anchoredBy: msg.sender
        });

        emit ReportAnchored(
            reportId,
            projectId,
            reportHash,
            block.timestamp,
            msg.sender
        );
    }
}