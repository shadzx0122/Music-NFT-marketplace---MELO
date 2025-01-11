import React, { useState, useEffect,  useContext } from 'react';
import './navbar.css';
import logo from '../../assets/logo.png';
import { Link } from 'react-router-dom';
import { ethers } from "ethers"
import MusicNFTMarketplaceAbi from '../../contractsData/MusicNFTMarketplace.json'
import MusicNFTMarketplaceAddress from '../../contractsData/MusicNFTMarketplace-address.json'
import UserContext from '../context/usercontext';

const Navbar = () => {
  
  const { user, setUser, setLoading, account, setAccount, setContract, setMyitem} = useContext(UserContext);
  const [isDisabled, setIsDisabled] = useState(true);

  useEffect(() => {
    if(account!=null){
    setIsDisabled(false); 
    } else setIsDisabled(true);
  }, [account]); 

  const handleLogout = () => {
    setUser(false);
    setAccount(null);
    setContract({});
    setLoading(true);
  };

  const handleExplore = () =>{
     setMyitem(false);
  }

  const handleMyitem = () =>{
      setMyitem(true);
  }

  const web3Handler = async () => {
    try {
       if (window.ethereum) {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            setAccount(accounts[0])
            // Get provider from Metamask
            const provider = new ethers.providers.Web3Provider(window.ethereum)
            // Get signer
            const signer = provider.getSigner()
            loadContract(signer)
          } else {
                    alert('MetaMask extension not detected. Please install MetaMask to use this feature.');
                  }
                } catch (error) {
                  console.error('Error connecting to MetaMask:', error);
                  alert('Error connecting to MetaMask. Please try again.');
                }
  }
  
  async function loadContract(signer) {
    // Get deployed copy of music nft marketplace contract
    const contract = new ethers.Contract(MusicNFTMarketplaceAddress.address, MusicNFTMarketplaceAbi.abi, signer);
    setContract(contract);
    setLoading(false);
  }

  const Menu = () => (
    <>     
      <Link to="/">
        <p className="underline-btn" onClick={handleExplore}>Explore</p>
      </Link>
      { account ? (
      <>
      <Link to ="/myitem">
      <p className="underline-btn" onClick={handleMyitem}>My Items</p>
      </Link>   
      </> )
      : <></>}
      { user ? (
        <>
        <Link to ="/trans">
        <p className="underline-btn" >Transactions</p>
        </Link> 
        <Link to="/login">
          <p className="underline-btn" onClick={handleLogout}>Logout</p>
        </Link>
        </>
      ): <></>}
    </>
  );

  return (
    <div className='navbar'>
      <div className="navbar-links">
        <div className="navbar-links_logo">
          <img src={logo} alt="logo" />
        </div>
        <div className="navbar-links_container">
          <Menu />
          { account && 
          <div className="navbar-search">
            <input type="text" placeholder='Search Item Here' autoFocus={true} />
          </div>}
        </div>
      </div>
      <div className="navbar-sign">
        {user ? (
          <>
            {/* <Link to="/create">
              <button type='button' className='primary-btn' disabled={isDisabled}>Create</button>
            </Link> */}
            <button type='button' className='secondary-btn' onClick={web3Handler} >
              { account ? account.slice(0, 5) + '...' + account.slice(40, 42) : 'Connect'}
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button type='button' className='primary-btn'>Sign In</button>
            </Link>
            <Link to="/register">
              <button type='button' className='secondary-btn'>Sign Up</button>
            </Link>
          </>
        )}
      </div>
    </div>
    
  );
}

export default Navbar;

