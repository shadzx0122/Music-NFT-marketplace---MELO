
//import Image from '../../assets/Image.png'

import React, { useState } from 'react';
import './register.css';  
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; 

const Register = () => {
  const navigate = useNavigate(); 
  const [username, setusername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernamechange = (event) => {
    setusername(event.target.value);
  }
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/register', { username, email, password });

      if (response.data.success) {
        // Navigate to the login page after successful registration
        navigate('/login');
        
      } else if(!response.data.success){
          alert(response.data.message);
      } else 
      {
        console.error('Registration failed');
      }
    } catch (error) {
      alert('Registration failed');
    }
  };

  return (
    <div className='register section__padding'>
      <div className="register-container">
        <h1>register</h1>
        {/* <p className='upload-file'>Upload Profile pic</p>
        <div className="upload-img-show">
          <img src={Image} alt="banner" />
          <p>browse media on your device</p>
        </div> */}
        <form className='register-writeForm' onSubmit={handleSubmit} autoComplete='off'>
          {/* <div className="register-formGroup">
            <label>Upload</label>
            <input type="file" className='custom-file-input'/>
          </div>
          <div className="register-formGroup">
            <label>Full Name</label>
            <input type="text" placeholder='Name' />
          </div> */}
          <div className="register-formGroup">
            <label>Username</label>
            <input type="text" placeholder='Username' name='username' id='username' value={username} onChange={handleUsernamechange} required/>
          </div>
          <div className="register-formGroup">
            <label>Email</label>
            <input type='email' name='email' id='email' value={email} onChange={handleEmailChange} placeholder='Email' required />
          </div>
          <div className="register-formGroup">
            <label>Password</label>
            <input type='password' name='password' id='password' value={password} onChange={handlePasswordChange} placeholder='Password' required />
          </div>
         <div className="register-button">
          <button type="submit" className='register-writeButton'>register</button>
          <Link to="/login">
            <button className='reg-login-writeButton'>Login</button>
          </Link>
         </div>
        </form>
      </div>
    </div>
   )
};

export default Register;
