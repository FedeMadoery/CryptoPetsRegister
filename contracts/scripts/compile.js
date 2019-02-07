const path = require('path');
const fs = require('fs');
const solc = require('solc');

let reqPath = path.join(__dirname, '../');
const contractPath = path.resolve(reqPath, 'solidity-contracts', 'PetsManager.sol');
const source = fs.readFileSync(contractPath, 'utf8');

module.exports = solc.compile(source, 1).contracts[':PetsManager'];
