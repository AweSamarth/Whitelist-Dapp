//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract whitelist{
    uint8 public maxWhitelistedAddresses;
    uint8 public numAddressesWhiteListed;
    mapping(address=>bool) public whitelistedAddresses;

    constructor(uint8 _maxWhitelistedAddresses){
        maxWhitelistedAddresses=_maxWhitelistedAddresses;

    }
    function addAddresstoWhiteList() public{
        require(!whitelistedAddresses[msg.sender], "Sender already in the whitelist"); 
        require(numAddressesWhiteListed<maxWhitelistedAddresses,"Max limit reached, your lazy a$$ missed out!");
        whitelistedAddresses[msg.sender]=true;
        numAddressesWhiteListed+=1;
    }
}

