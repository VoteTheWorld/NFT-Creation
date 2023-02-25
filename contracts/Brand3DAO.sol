// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "erc721a/contracts/ERC721A.sol";

error NotOwner();

contract Brand3DAO is ERC721A {
    address private owner;
    string private token_URI =
        "ipfs://QmZGnpGnL6vGErj17d8734juNfPYr8nCRn2wSMN5Du28jK";

    constructor() ERC721A("Brand3DAO", "B3D") {
        _mint(msg.sender, 10);
        owner = msg.sender;
    }

    modifier onlyOwner() {
        if (msg.sender == owner) {
            _;
        } else {
            revert NotOwner();
        }
    }

    function mint(uint256 quantity) external payable {
        _mint(msg.sender, quantity);
    }

    function tokenURI(
        uint256 /*tokenId*/
    ) public view override returns (string memory) {
        return token_URI;
    }

    function batchMint(address to, uint256 quantity) public onlyOwner {
        _mint(to, quantity);
    }
}
