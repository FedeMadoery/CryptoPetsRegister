const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const basePath = path.join(__dirname, '../');

const buildPath = path.resolve(basePath, 'public');
fs.removeSync(buildPath);

const contractPath = path.resolve(basePath, 'solidity-contracts', 'PetsOwnership.sol');
const source = fs.readFileSync(contractPath, 'utf8');
const output = solc.compile(source, 1).contracts;

console.log(output);

fs.ensureDirSync(buildPath);

for (let contract in output) {
    fs.outputJsonSync(
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        output[contract]
    );
}

console.log('Compile finish');