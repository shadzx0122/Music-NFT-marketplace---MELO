import React, { useContext } from 'react';
import {Bids, Header } from '../../components'
import UserContext from '../../components/context/usercontext';
import './home.css'


const Home = () => {

  const {loading, user}  = useContext(UserContext);
  
  return (
  
  user && loading ? (  
    <div className="load">
    <style>
      @import url('https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&family=Manjari:wght@100;400;700&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&family=Silkscreen:wght@400;700&display=swap')
    </style>
        <span className="loader"></span>
        <span className='text'>Awaiting Metamask Connection</span> 
      
    </div>) 
  :(
  <div>
   <Header />
   <Bids title="Hot Bids"/>
  </div>)
  )
};

export default Home;
