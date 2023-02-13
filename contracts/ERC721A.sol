// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "erc721a/contracts/ERC721A.sol";

contract Brand3DAO is ERC721A {
    string public constant TOKEN_URI =
        "ipfs://QmaVkBn2tKmjbhphU7eyztbvSQU5EXDdqRyXZtRhSGgJGo";

    constructor() ERC721A("Brand3DAO", "BTD") {
        _mint(msg.sender, 10);
    }

    function mint(uint256 quantity) external payable {
        _mint(msg.sender, quantity);
    }

    function batchMint(address to, uint256 quantity) external {
        _mint(to, quantity);
    }

    function tokenURI(
        uint256 /*tokenId*/
    ) public pure override returns (string memory) {
        return TOKEN_URI;
    }
}
