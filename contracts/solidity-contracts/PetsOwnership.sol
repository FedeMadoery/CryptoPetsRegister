pragma solidity ^0.5.2;

import "./PetsManager.sol";
import "./commons/ETC721.sol";

contract PetsOwnership is PetsManager, ERC721{

    mapping (uint => address) petApprovals;

    function ownerOf(uint256 _tokenId) public view returns (address _owner) {
        return petToOwner[_tokenId];
    }

    function _transfer(address _from, address _to, uint256 _tokenId) private {
        petToOwner[_tokenId] = _to;
        Transfer(_from, _to, _tokenId); // Event to announce that a pet was transfer
    }

    function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        require(_to != address(0), "Is not possible transfer to address 0");
        _transfer(msg.sender, _to, _tokenId);
    }

    function approve(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
        petToOwner[_tokenId] = _to;
        Approval(msg.sender, _to, _tokenId); // Event to announce that a pet transfer was approved
    }

    function takeOwnership(uint256 _tokenId) public {
        require(petToOwner[_tokenId] == msg.sender);
        address owner = ownerOf(_tokenId);
        _transfer(owner, msg.sender, _tokenId);
    }
}
