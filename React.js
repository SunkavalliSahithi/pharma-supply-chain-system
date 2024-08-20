import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import PharmaSupplyChain from './contracts/PharmaSupplyChain.json';

function App() {
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [drugs, setDrugs] = useState([]);

    useEffect(() => {
        loadBlockchainData();
    }, []);

    const loadBlockchainData = async () => {
        const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = PharmaSupplyChain.networks[networkId];
        const instance = new web3.eth.Contract(PharmaSupplyChain.abi, deployedNetwork && deployedNetwork.address);
        setContract(instance);

        const drugCount = await instance.methods.drugCounter().call();
        const drugList = [];
        for (let i = 1; i <= drugCount; i++) {
            const drug = await instance.methods.getDrugDetails(i).call();
            drugList.push(drug);
        }
        setDrugs(drugList);
    };

    const addDrug = async (name, manufacturer, manufactureDate, expiryDate) => {
        await contract.methods.addDrug(name, manufacturer, manufactureDate, expiryDate).send({ from: account });
        loadBlockchainData();
    };

    const transferOwnership = async (id, newOwner) => {
        await contract.methods.transferOwnership(id, newOwner).send({ from: account });
        loadBlockchainData();
    };

    return (
        <div>
            <h1>Pharma Supply Chain System</h1>
            <p>Your Account: {account}</p>
            {/* UI components for adding drugs, transferring ownership, etc. */}
        </div>
    );
}

export default App;
