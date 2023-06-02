//SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.10;

import "./ERC721_Implementation.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";

contract ERC721_Factory {
    event CreateNFTCollection(address creator, address collection);

    /**
     * @notice ERC721 Implementation address.
     */
    address public ERC721_Implementation_address;

    constructor(address _ERC721_Implementation) {
        ERC721_Implementation_address = _ERC721_Implementation;
    }

    function setupNFTCollection(
        string memory _contract_name,
        string memory _symbol_name,
        uint256 _salePrice,
        uint256 _maxSupply,
        bytes32 salt
    ) external returns (address) {
        address clone = Clones.cloneDeterministic(ERC721_Implementation_address, salt);
        NFTCollection(clone).initialize(_contract_name, _symbol_name, _salePrice, _maxSupply);
        emit CreateNFTCollection(msg.sender, clone);
        return clone;
    }
}
