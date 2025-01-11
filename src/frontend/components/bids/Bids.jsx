import React, { useState, useEffect,  useContext, useRef } from 'react';
import './bids.css';
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { Link } from 'react-router-dom';
import UserContext from '../context/usercontext';
import { ethers } from "ethers";
import {  Button, InputGroup, Form } from 'react-bootstrap';

function hexToInteger(hexString) {
  if (hexString.startsWith("0x") || hexString.startsWith("0X")) {
    hexString = hexString.slice(2);
  }
  return parseInt(hexString, 16);
}


const Bids = ({title}) => {

  const {contract , user , myitem } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const [marketItems, setMarketItems] = useState(null);
  const [myTokens , setMyTokens] = useState(null);
  const [resellId, setResellId] = useState(null);
  const [resellPrice, setResellPrice] = useState(null);
  const audioRefs = useRef([]);
  const [isPlaying, setIsPlaying] = useState(null);
  const [selected, setSelected] = useState(0);
  const baseURI = "https://black-cheap-basilisk-940.mypinata.cloud/ipfs/QmdHXYnGCkRf1vgCUEWxMz2HcBZKztZ4ZPmg5JcYC4vvm9/";
  
  const loaddummy = [
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
    { id: 3, name: 'Item 3' },
    { id: 4, name: 'Item 4' },
    { id: 5, name: 'Item 5' },
    { id: 6, name: 'Item 6' },
    { id: 7, name: 'Item 7' },
    { id: 8, name: 'Item 8' }
  ];

  const loadMarketplaceItems = async () => {
    setLoading(true)
    if(user){
    try{
    // Get all unsold items/tokens
    const results = await contract.getAllUnsoldTokens();
    const marketItem = await Promise.all(results.map(async i => {
      // use uri to fetch the nft metadata stored on ipfs 
      const response = await fetch(baseURI + hexToInteger(i.tokenId._hex) + ".json")
      const metadata = await response.json()
      let item = {
        index: metadata.tokenId + 1,
        price: i.price,
        itemId: i.tokenId,
        name: metadata.name,
        artist: metadata.artist,
        description: metadata.description,
        audio: metadata.audio
      }
      return item
    }))
    
    setMarketItems(marketItem)
    setLoading(false) 
  } catch(error){
        alert('Blockchain Inactive.')
    }
  } 
}
 
const loadMyItems = async () => {
  setLoading(true)
  if(user){
  try{
  // Get all unsold items/tokens
  const results = await contract.getMyTokens();
  const myToken = await Promise.all(results.map(async i => {
    // use uri to fetch the nft metadata stored on ipfs 
    const response = await fetch(baseURI + hexToInteger(i.tokenId._hex) + ".json")
    const metadata = await response.json()
    let item = {
      index: metadata.tokenId + 1,
      price: i.price,
      itemId: i.tokenId,
      name: metadata.name,
      audio: metadata.audio
    }
    return item
  }))
  setMyTokens(myToken)
  setLoading(false) 
} catch(error){
      alert('Blockchain Inactive.')
  }
}
}
 
const resellItem = async (item) => {
  if (item.itemId !== resellId || !resellPrice || resellPrice < 0) return
  try{
      const fee = await contract.royaltyFee()
      const price = ethers.utils.parseEther(resellPrice.toString())
      await (await contract.resellToken(item.itemId, price, { value: fee })).wait()
      loadMyItems() 
  }catch(error){
      alert((error.data.message).split("'")[1])
  }
}

const Card1 = ({ index, name, token }) => {
  return (
    <div className="card-column">
      <audio src={token.audio} key={index} ref={el => audioRefs.current[index] = el}></audio>
      <div className="bids-card">
        <div className="bids-card-top">
          <img src={require(`../../assets/bids_img/bids${index}.png`)} alt="Bid" />
            <p className="bids-title" id='style'>{name}</p>
        </div>
        <div className="bids-card-bottom">
        <div className='play'>
        <Button
          variant="secondary"
          style={{ backgroundColor: "#2A2D3A", color: "white", border: "none" }}
          onClick={() => {
            setSelected(index);
            setIsPlaying(!isPlaying);
          }}>
          {isPlaying && selected === index ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5zm4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5z" />
              </svg>
          ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z" />
              </svg>
          )}
        </Button>
        </div>
          <p><span>
          <InputGroup className="my-1">
              <Form.Control className='resell_form'
                onChange={(e) => {
                  setResellId(token.itemId)
                  setResellPrice(e.target.value)
                }}
                size="md"
                value={resellId === token.itemId ? resellPrice : ''}
                required type="number"
                placeholder="Price in ETH"
              />
              <Button className='resell_butt' onClick={() => resellItem(token)}>
                Resell
              </Button>
          </InputGroup>
          </span></p>
        </div>
      </div>
    </div>
  );
};

const Card2 = ({ index, name, price, token }) => {
  const [isliked, setIsliked] = useState(false);
  const handleLike = () => {
    setIsliked(!isliked);
  }
  return (
    <div className="card-column">
      <div className="bids-card">
        <div className="bids-card-top">
          <img src={ require(`../../assets/bids_img/bids${index}.png`)} alt="Bid" />
          <Link to={`/${name}/${index}`} state={{ token }} >
            <p className="bids-title">{name}</p>
          </Link>
        </div>
        <div className="bids-card-bottom">
          <p>{ethers.utils.formatEther(price)}<span>ETH</span></p>
          <p className='like' onClick={handleLike}>{isliked ? <AiFillHeart size={20} style={{ color: '#dc2323' }}/> : <AiOutlineHeart size={20}/>}</p>
        </div>
      </div>
    </div>
  );
};

useEffect(() => {
  if (isPlaying !== null && audioRefs.current[selected]) {
    if (isPlaying) {
      audioRefs.current[selected].play();
    } else {
      audioRefs.current[selected].pause();
    }
  }
}, [isPlaying, selected]);


useEffect(() => {
  if(myitem){
    !myTokens && loadMyItems()
  } else{
    !marketItems && loadMarketplaceItems()
  }
},[]);


if (loading) return (
  <div className='bids section__padding'>
  <div className="bids-container">
    <div className="bids-container-text">
      <h1>{title}</h1>
    </div>
    <div className="loadcard">
    {loaddummy.map((item) => (
      <div key={item.id}>
          <div className="loadcol" >      
            <div className="card loading">
                <div className="image">
                </div>
                <div className="content">
                  <h4></h4>
                    <div className="description">
                    </div>
                </div>
            </div>
          </div>
      </div>    
      ))}    
    </div>      
  </div>
  <div className="load-more">
      <button disabled={true}>Load More</button>
  </div>
  </div>
)

   return (
     myitem ? (
      myTokens.length > 0 ? (
      <>
        <div className='bids section__padding'>
          <div className="bids-container">
            <div className="bids-container-text">
              <h1>{title}</h1>
            </div>
            <div className="bids-container-card">
                {myTokens.map((item) => (
                  <Card1 key={item.itemId} index={item.index} name={item.name} token={item}/>
                ))}
            </div>
          </div>
        </div> 
      </> 
    ) : (
    <> 
      <div className='bids section__padding'>
        <div className="bids-container">
          <div className="bids-container-text">
            <h1>{title}</h1>
          </div>   
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Manjari:wght@100;400;700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Silkscreen:wght@400;700&display=swap')
          </style>
          <p className="centered-bold">No Owned Items</p>
        </div>
      </div>
    </>
  )
    
    ) : (
       marketItems.length > 0 ? (
        <>
        <div className='bids section__padding'>
          <div className="bids-container">
            <div className="bids-container-text">
              <h1>{title}</h1>
            </div>
            <div className="bids-container-card">
                {marketItems.map((item) => (
                  <Card2 key={item.itemId} index={item.index} name={item.name} price={item.price} token={item}/>
                ))}
            </div>
          </div>
          <div className="load-more">
            <button>Load More</button>
          </div>
        </div>
      </> ) : (
      <> 
        <div className='bids section__padding'>
          <div className="bids-container">
            <div className="bids-container-text">
              <h1>{title}</h1>
            </div>   
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Manjari:wght@100;400;700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Silkscreen:wght@400;700&display=swap')
            </style>
            <p className="centered-bold">No Market Items Listed</p>
          </div>
        </div>
      </>
    ))
  )   
}

export default Bids;