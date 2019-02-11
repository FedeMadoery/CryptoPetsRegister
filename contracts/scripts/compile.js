const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const basePath = path.join(__dirname, '../');
const commonBasePath = path.join(__dirname, '../solidity-contracts');

const buildPath = path.resolve(basePath, 'public');
fs.removeSync(buildPath);

const contractPath1 = path.resolve(basePath, 'solidity-contracts', 'PetsManager.sol');
const contractPath2 = path.resolve(basePath, 'solidity-contracts', 'PetsOwnership.sol');
const contractPath3 = path.resolve(commonBasePath, 'commons', 'Ownable.sol');
const contractPath4 = path.resolve(commonBasePath, 'commons', 'ERC721.sol');

var input = {
    'ERC721.sol': fs.readFileSync(contractPath4, 'utf8'),
    'Ownable.sol': fs.readFileSync(contractPath3, 'utf8'),
    'PetsOwnership.sol': fs.readFileSync(contractPath2, 'utf8'),
    'PetsManager.sol': fs.readFileSync(contractPath1, 'utf8')
};

const output = solc.compile({sources: input}, 1).contracts;

console.log(output);

fs.ensureDirSync(buildPath);

for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}

console.log('Compile finish');