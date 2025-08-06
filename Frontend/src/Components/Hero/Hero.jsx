import React from 'react'
import './Hero.css'
import HandIcon from '../../assets/Frontend_Assets/hand_icon.png';
import ArrowIcon from '../../assets/Frontend_Assets/arrow.png'
import HeroImage from '../../assets/Frontend_Assets/hero_image.png'

const Hero = () => {
  return (
    <div className='hero'>
      <div className="hero-left">
        <h2>New Arrivals Only</h2>
        <div>
            <div className="hero-hand-icon">
                <p>new</p>
                <img src={HandIcon} alt=""/>
            </div>
            <p>Collections</p>
            <p>for everyone</p>
        </div>
        <div className="hero-latest-btn">
            <div>Latest Collection</div>
            <img src={ArrowIcon} alt=""/>
        </div>
      </div>
      <div className="hero-right">
        <img src={HeroImage} alt="" />
      </div>
    </div>
  )
}

export default Hero
