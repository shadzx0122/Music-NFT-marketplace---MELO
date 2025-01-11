import React from 'react'
import './header.css'
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import seller1 from '../../assets/user_img/user1.png'
import seller2 from '../../assets/user_img/user2.png'
import seller3 from '../../assets/user_img/user3.png'
import seller4 from '../../assets/user_img/user4.png'
import seller5 from '../../assets/user_img/user5.png'
import seller6 from '../../assets/user_img/user6.png'
import verify from '../../assets/verify.png'
import coin from '../../assets/coin.png'


const Header = () => {
  var settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    initialSlide: 0,
    swipeToSlide:true,
    responsive: [
      {
        breakpoint: 1160,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          swipeToSlide:true,
        }
      },
      {
        breakpoint: 950,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          swipeToSlide:true,
        }
      },
      {
        breakpoint: 750,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2,
        }
      },
      {
        breakpoint: 550,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1
        }
      },
      {
        breakpoint: 470,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 400,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          variableWidth: true,
        }
      }
    ]
  };
  return (
    <div className='header section__padding'>
      <div className="header-content">
        <div>
          <h1>Discover, collect, and sell music NFTs</h1>
          <img className='shake-vertical' src={coin} alt="" />
        </div>
      </div>
      <div className="header-slider">
        <h1>Top Sellers</h1>
       <Slider {...settings} className='slider'>
            <div className='slider-card'>
              <p className='slider-card-number'>1</p>
              <div className="slider-img">
                <img src={seller1} alt="" />
                <img src={verify} className='verify' alt="" />
              </div>
              <p className='slider-card-name'>Cameron</p>
              <p className='slider-card-price'>5.250 <span>ETH</span></p>
            </div>
            <div className='slider-card'>
              <p className='slider-card-number'>2</p>
              <div className="slider-img">
                <img src={seller2} alt="" />
                <img src={verify} className='verify' alt="" />
              </div>
              <p className='slider-card-name'>Rohit</p>
              <p className='slider-card-price'>4.932 <span>ETH</span></p>
            </div>
            <div className='slider-card'>
              <p className='slider-card-number'>3</p>
              <div className="slider-img">
                <img src={seller3} alt="" />
                <img src={verify} className='verify' alt="" />
              </div>
              <p className='slider-card-name'>Josh</p>
              <p className='slider-card-price'>4.620 <span>ETH</span></p>
            </div>
            <div className='slider-card'>
              <p className='slider-card-number'>4</p>
              <div className="slider-img">
                <img src={seller4} alt="" />
                <img src={verify} className='verify' alt="" />
              </div>
              <p className='slider-card-name'>Rony</p>
              <p className='slider-card-price'>4.125 <span>ETH</span></p>
            </div>
            <div className='slider-card'>
              <p className='slider-card-number'>5</p>
              <div className="slider-img">
                <img src={seller5} alt="" />
                <img src={verify} className='verify' alt="" />
              </div>
              <p className='slider-card-name'>Kevin</p>
              <p className='slider-card-price'>3.921 <span>ETH</span></p>
            </div>
            <div className='slider-card'>
              <p className='slider-card-number'>6</p>
              <div className="slider-img">
                <img src={seller6} alt="" />
                <img src={verify} className='verify' alt="" />
              </div>
              <p className='slider-card-name'>Alex</p>
              <p className='slider-card-price'>3.548 <span>ETH</span></p>
            </div>
        </Slider>
      </div>
    </div>
  )
}

export default Header
