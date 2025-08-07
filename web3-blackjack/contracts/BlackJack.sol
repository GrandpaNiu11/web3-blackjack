// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {ERC721URIStorage} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract MyToken is  ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    string constant META_DATA = "ipfs://QmdAg4hnHVRLZHmL6cfVYvUnDpXCo8kpjuLasuXCCNhCv4";
    uint tokenId=0;

    constructor(address initialOwner)
    ERC721("MyToken", "MTK")
    Ownable(initialOwner)
    {}

    function safeMint(address to)
    public
    returns (uint256)
    {
        tokenId ++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId,  META_DATA);
        return tokenId;
    }



}