import { React, useContext } from 'react';
import './myitem.css'
import profile_banner from '../../assets/profile_banner.png'
import profile_pic from '../../assets/profile.jpg'
import Bids from '../../components/bids/Bids'
import UserContext from '../../components/context/usercontext';

const Myitem = () => {

  const { username, userid } = useContext(UserContext);

    return (
        <>
          <div className='profile section__padding'>
            <div className="profile-top">
              <div className="profile-banner">
                <img src={profile_banner} alt="banner" />
              </div>
              <div className="profile-pic">
                  <img src={require(`../../assets/user_img/user${userid}.png`)} alt="profile" />
                  <h3>{username}</h3>
              </div>
            </div>
            <div className="profile-bottom">
              <div className="profile-bottom-input">
                <input type="text" placeholder='Search Item here' />
              </div>
            </div>
          </div>
          <div>
            <Bids   title="My NFTs" />
          </div>
        </>
    );
  };
  
  export default Myitem;