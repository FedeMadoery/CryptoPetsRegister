pragma solidity ^0.4.0;

import "./PetsManager.sol";
import "./ETC721.sol"

contract PetsOwnership is PetsManager, ERC721{
    function PetsOwnership(){

    }

    mapping (uint => address) petApprovals;

    function ownerOf(uint256 _tokenId) public view returns (address _owner) {
        return petToOwner[_tokenId];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        petToOwner[_tokenId] = _to;
        Transfer(_from, _to, _tokenId);
    }

    function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        petToOwner[_tokenId] = _to;
        Approval(msg.sender, _to, _tokenId);
    }

    function takeOwnership(uint256 _tokenId) public {
        require(petToOwner[_tokenId] == msg.sender);
        address owner = ownerOf(_tokenId);
        _transfer(owner, msg.sender, _tokenId);
    }
}
