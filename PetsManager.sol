pragma solidity ^0.5.2;

import "./Ownable.sol";

contract PetsManager is Ownable {

    uint dnaDigits = 32;
    uint dnaModulus = 10 ** dnaDigits;
    uint changeNameFee = 0.001 ether;

    modifier onlyOwnerOf(uint _petId) {
        require(msg.sender == petToOwner[_petId]);
        _;
    }

    event NewPet(uint petId, string name, uint dna);

    function PetsManager(){

    }

    struct Pet {
        string name;
        string breed; // TODO re-think the breed model
        uint dna; // If its gen0 the DNA will be the original number of certificate pure breed
        uint fatherId; // Address to identify the father
        uint motherId; // Address to identify the mother
    }

    Pet[] public pets;
    mapping (uint => address) public petToOwner;

    function _createPet(string _name, string _breed, uint _dna, uint _fatherId, uint _motherId) private {
        uint id = pets.push(Pet(_name, _breed, _dna, _fatherId, _motherId));
        petToOwner[id] = msg.sender;
        NewPet(id, _name, _dna);
    }

    // Function to create the first pets with no parents saved, only the owner can create that's ones
    function _createGen0Pets(string _name, string _breed, uint _dna) external onlyOwner {
        _createPet(_name, _breed, _dna, 0, 0);
    }

    function _generateRandomDna(string _str) private view returns (uint) {
        uint rand = uint(keccak256(_str));
        return rand % dnaModulus;
    }

    function registerPet(string _name, uint _fatherId, uint _motherId) external {
        require(pets[_fatherId].exists, "Father does not exist.");
        require(pets[_motherId].exists, "Mother does not exist.");
        Pet memory father = pets[_fatherId];
        Pet memory mother = pets[_motherId];

        // The child will be pure breed if the father and mother has the same breed
        string breed = (father.breed == mother.breed ? mother.breed : "Half Blood" );

        uint dna = _generateRandomDna( (father.dna + mother.dna)/mother.dna + _name + breed );
        _createPet(_name, breed, dna, _fatherId, _motherId);
    }

    function changeName(uint _petId, string _newName) external payable onlyOwnerOf(_petId) {
        require(msg.value == changeNameFee);
        pets[_petId].name = _newName;
    }

    function withdraw() external onlyOwner {
        owner.transfer(this.balance);
    }
}
