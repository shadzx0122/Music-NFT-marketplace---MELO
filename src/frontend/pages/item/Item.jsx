import React, { useContext, useState } from 'react'
import './item.css'
import creator from '../../assets/user_img/user2.png'
import { useLocation } from 'react-router-dom'
import UserContext from '../../components/context/usercontext'
import { ethers } from "ethers"
import { Link, useNavigate} from 'react-router-dom';

const LoadingIndicator = () => {
  return (
    <div className='opaque'>
      <div className="load">
          <span className="loader"></span>  
      </div>
    </div>
  )
}

const Item = () => {

  const location = useLocation();
  const { token } = location.state;
  const {contract} = useContext(UserContext);
  const [t ,setT] = useState(null);
  const [buy,setBuy] = useState(false);
  const nav = useNavigate();

  const loadtotal = async () => {
  try {
  const total = ethers.utils.formatEther(await contract.getTotalSupply()) * Math.pow(10, 18);
  setT(total)
  }catch(error){
    alert('Error Connecting to Blockchain')
    }
  }

  loadtotal();

  const buyMarketItem = async (item) => {
    setBuy(true);
    try {
      await (await contract.buyToken(item.itemId, { value: item.price })).wait();
    } catch (error) {
      alert((error.data.message).split("'")[1])
    } finally {
      setBuy(false);
      nav('/');
    }
  };
  
  return( 
    (buy ? <LoadingIndicator /> : (
        <>
          <div className='item section__padding'>
            <div className="item-image">
              <img src={require(`../../assets/bids_img/bids${token.index}.png`)} alt="item" />
            </div>
              <div className="item-content">
                <div className="item-content-title">
                  <h1>{token.name}</h1>
                  <p>For <span>{ethers.utils.formatEther(token.price)} ETH</span>  ‧  {token.index}  of  {t} </p>
                </div>
                <div className="item-content-creator">
                  <div><p>Creater</p></div>
                  <div>
                    <img src={creator} alt="creator" />
                    <p>{token.artist}</p>
                  </div>
                </div>
                <div className="item-content-detail">
                  <p>{token.description}</p>
                </div>
                <div className="item-content-buy">
                  <button className="primary-btn" onClick={() => buyMarketItem(token)}>Buy For {ethers.utils.formatEther(token.price)} ETH </button>
                  <Link to ='/'>
                  <button className="secondary-btn">Back</button>
                  </Link>
                </div>
              </div>
          </div>
        </>  ))
  )
};

export default Item;
