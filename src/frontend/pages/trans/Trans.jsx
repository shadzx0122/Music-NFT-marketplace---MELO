import {React, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import UserContext from '../../components/context/usercontext';
import './trans.css'

const provider = new ethers.providers.JsonRpcProvider('http://127.0.0.1:8545/');

const  estimateGasFeeForBlock = (block) => {
  try {
    if (!block || !block.gasUsed) {
      throw new Error('Invalid block object. Missing required properties.');
    }
    const gasUsedInGwei = ethers.utils.formatUnits(block.gasUsed, 'gwei');
    return gasUsedInGwei; 
  } catch (error) {
    console.error('Error:', error);
  }
};


const Trans = () => {
  const { account } = useContext(UserContext); 
  const [transactions, setTransactions] = useState([]);
  const [blockData, setBlockData] = useState([]);

    const fetchData = async () => {
      if (account) {
        try {
          let transactions = [];
          let Allblock = [];
          const blockNumber = await provider.getBlockNumber();
          for (let i = blockNumber; i >= 0; i--) { 
            const block = await provider.getBlockWithTransactions(i, true);
            const txn = block.transactions;
            transactions = transactions.concat(
              txn.filter((tx) => tx && tx.from.toLowerCase() === account)
            );
            let fee = estimateGasFeeForBlock(block);
            Allblock.push({ ...block, fee });
          }
          setTransactions(transactions);
          setBlockData(Allblock);

        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    };

    useEffect(() => {
        fetchData();
    },[]); 

    const renderTransactions = () => {
      return (
        <div className="transaction-list">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <div className="transaction" key={tx.hash}>
                <p>From: {tx.from}</p>
                <p>To: {tx.to}</p>
                <p>Txn Hash: {tx.hash}</p>
                <p>Transaction Value: {(ethers.utils.formatUnits(tx.value, 'ether')).toString()} ETH</p>
                <p>Block Number: {tx.blockNumber}</p>
                <p>Block Hash: {tx.blockHash}</p>
              </div>
            ))) : (<div></div>)
          } 
        </div>
      );
    };
  
    const renderBlockData = () => {
      if (!blockData) {
        return <div></div>;
      }
      return (
      <div className="transaction-list">
      { blockData.length > 0 ? (
          blockData.map((b) => (
        <div className="block-data" key={b.hash}>
          <p>Block Hash: {b.hash}</p>
          <p>Parent Hash: {b.parentHash}</p>
          <p>Timestamp: {new Date(b.timestamp * 1000).toLocaleString()}</p>
          <p>Difficulty: {b.difficulty.toString()}</p>
          <p>Gas Fee: {b.fee.toString()} gwei</p>
          <p>Block Number: {b.number}</p>
        </div>
        ))) : (<div></div>)
      } 
      </div> 
      );
    };
  
    return (
      <div className="terminal-container">
        {account && (
          <>
            <h3>Your Transactions</h3>
            {renderTransactions()}
            <h3>Latest Block Data</h3>
            {renderBlockData()}
          </>
        )}
        {!account && <p className="no-wallet-message">Please connect your wallet to view data</p>}
      </div>
    );
  };

export default Trans;
