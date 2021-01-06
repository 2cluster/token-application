//SPDX-License-Identifier: Unlicense
pragma solidity ^0.7.5;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "./owned.sol";

contract NFT is ERC721, owned {
    constructor() ERC721("NFT", "NFT") {
    }
    
    function Mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }
    
    function Transfers(address to, uint256 amount) public {
        _transfer(_msgSender(), to, amount);
    }
}