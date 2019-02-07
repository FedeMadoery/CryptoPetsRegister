pragma solidity ^0.4.25;

import "./commons/Ownable.sol";

contract PetsManager is Ownable {

    uint dnaDigits = 32;
    uint dnaModulus = 10 ** dnaDigits;
    uint changeNameFee = 0.001 ether;
    uint changeSexFee = 0.002 ether;

    modifier onlyOwnerOf(uint _petId) {
        require(msg.sender == petToOwner[_petId]);
        _;
    }

    event NewPet(uint petId, string name, uint dna);


    struct Breed {
        string breedType; // Name of the breed
        string subType; // Variations of the same breed
    }

    struct Pet {
        string name;
        string color;
        Breed breed; // TODO re-think the breed model
        uint8 sex; // 0 Male - 1 Female
        uint dna; // If its gen0 the DNA will be the original number of certificate pure breed
        uint fatherId; // Address to identify the father
        uint motherId; // Address to identify the mother
        bool exists;
    }

    Pet[] public pets;
    mapping (uint => address) public petToOwner;

    function _createPet(string _name, string _color, Breed _breed, uint8 _sex, uint _dna, uint _fatherId, uint _motherId) private {
        uint id = pets.push(Pet(_name, _color, _breed, _sex, _dna, _fatherId, _motherId, true));
        petToOwner[id] = msg.sender;
        emit NewPet(id, _name, _dna);
    }

    // Function to create the first pets with no parents saved, only the owner can create that's ones
    function _createGen0Pets(string _name, string _breedType, string _breedSubType, uint8 _sex, string _color, uint _dna) external onlyOwner {
        Breed memory breed = Breed(_breedType, _breedSubType);
        _createPet(_name, _color, breed, _sex, _dna, 0, 0);
    }

    function _generateRandomDna(bytes _str) private view returns (uint) {
        uint rand = uint(keccak256(_str));
        return rand % dnaModulus;
    }

    function _equalsBreed(Breed memory _first, Breed memory _second) internal pure returns (bool) {
        // Just compare the output of hashing all fields packed
        return(keccak256(abi.encodePacked(_first.breedType, _first.subType)) == keccak256(abi.encodePacked(_second.breedType, _second.subType)));
    }

    function registerPet(string _name, string _color, uint8 _sex, uint _fatherId, uint _motherId) external {
        require(pets[_fatherId].exists, "Father does not exist.");
        require(pets[_motherId].exists, "Mother does not exist.");
        Pet memory father = pets[_fatherId];
        Pet memory mother = pets[_motherId];

        // The child will be pure breed if the father and mother has the same breed
        Breed memory breed = (_equalsBreed(father.breed, mother.breed) ? mother.breed : Breed("Half Blood", "") );

        uint dna = _generateRandomDna( abi.encodePacked(father.name, mother.name, _name, _color, _sex));
        _createPet(_name, _color, breed, _sex, dna, _fatherId, _motherId);
    }

    function changeName(uint _petId, string _newName) external payable onlyOwnerOf(_petId) {
        require(msg.value == changeNameFee);
        pets[_petId].name = _newName;
    }

    function changeSex(uint _petId, uint8 _newSex) external payable onlyOwnerOf(_petId) {
        require(msg.value == changeSexFee);
        pets[_petId].sex = _newSex;
    }

    function changeColor(uint _petId, string _newColor) external payable onlyOwnerOf(_petId) {
        require(msg.value == changeNameFee);
        pets[_petId].color = _newColor;
    }

    function withdraw() external onlyOwner {
        owner().transfer(address(this).balance);
    }
}
