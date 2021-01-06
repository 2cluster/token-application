//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.5;

contract owned {
    constructor() public { owner = msg.sender; }
    address public owner;

    modifier onlyOwner {
        require(
            msg.sender == owner,
            "Only owner can call this function."
        );
        _;
    }
}