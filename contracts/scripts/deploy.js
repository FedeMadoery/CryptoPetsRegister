const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const readline = require('readline');
// const {interface, bytecode} = require('./compile');

/** Colors for the messages **/
FgRed = "\x1b[31m";
FgGreen = "\x1b[32m";
FgYellow = "\x1b[33m";
FgBlue = "\x1b[34m";
FgWhite = "\x1b[37m";
/** ---------  ---------  **/

// TODO implement some feature to pass that values
const RINKEBY = 'https://rinkeby.infura.io/v3/2052c39b562645f6b3c3794b3ab4912e';
const ROPSTEN = 'https://ropsten.infura.io/v3/2052c39b562645f6b3c3794b3ab4912e';
const KOVAN = 'https://kovan.infura.io/v3/2052c39b562645f6b3c3794b3ab4912e';
const MAINNET = 'https://mainnet.infura.io/v3/2052c39b562645f6b3c3794b3ab4912e';

/** Function to request some information **/
function askQuestion(query) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }))
}

const deploy = async () => {
    let NET_LINK;
    let ans_sure_mainnet = '';
    let exit = false;

    const ans_net_link = await askQuestion(
        "Enter the name of network that you want to deploy your contract\n " +
        "(RINKEBY -" + " ROPSTEN -" + " KOVAN -" + FgRed + " MAINNET" + FgWhite + ") \n "
    );

    switch (ans_net_link) {
        case 'RINKEBY':
            NET_LINK = RINKEBY;
            console.log(FgGreen + 'Network selected: ' + RINKEBY + "\n\n");
            break;
        case 'ROPSTEN':
            NET_LINK = ROPSTEN;
            console.log(FgGreen + 'Network selected: ' + ROPSTEN + "\n\n");
            break;
        case 'KOVAN':
            NET_LINK = KOVAN;
            console.log(FgGreen + 'Network selected: ' + KOVAN + "\n\n");
            break;
        case 'MAINNET':
            NET_LINK = MAINNET;
            console.log(FgGreen + 'Network selected: ' + MAINNET + "\n\n");
            ans_sure_mainnet = await askQuestion("Are you sure? (T/F): ");
            break;
        default:
            console.log(FgRed + 'Incorrect network\n');
            exit = true;
            break;
    }

    if(exit || ans_sure_mainnet === 'F' || ans_sure_mainnet === 'False' || ans_sure_mainnet === 'false') {
        return
    }

    let ans_mnemonic = await askQuestion("Enter the MNEMONIC\n");

    const provider = new HDWalletProvider(ans_mnemonic, NET_LINK);
    ans_mnemonic = null;

    web3 = new Web3(provider);
    const accounts = await web3.eth.getAccounts();

    console.log(FgYellow + 'Attemting deploy from account: ', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: '0x' + bytecode, arguments: ['Hi there!']})
        .send({from: accounts[0]});

    console.log(FgGreen + 'Contract deploy to: ', result.options.address);

};

deploy();