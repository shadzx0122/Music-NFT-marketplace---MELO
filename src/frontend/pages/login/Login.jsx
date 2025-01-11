import React, { useContext , useState } from 'react';
import './login.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserContext from '../../components/context/usercontext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, setUser, setUsername, setUserid } = useContext(UserContext);
  const nav = useNavigate();

  const handleLogin = (data) => {
    if(user===false){
      setUser(true);
      setUsername(data.name);
      setUserid(data.id);
    }
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('/login', { email, password });
      if (response.data.success) {
        handleLogin(response.data);
        nav('/');
        
      } else {
        alert('Authentication failed');
      }
    } catch (error) {
      alert('Invalid User or Password');
    }
  };

  return (
    <div className='login section__padding'>
      <div className='login-container'>
        <h1>Login</h1>
        <form className='login-writeForm' onSubmit={handleSubmit} autoComplete='off'>
          <div className='login-formGroup'>
            <label>Email</label>
            <input type='email' name='email' id='email' value={email} onChange={handleEmailChange} placeholder='Email' required />
          </div>
          <div className='login-formGroup'>
            <label>Password</label>
            <input type='password' name='password' id='password' value={password} onChange={handlePasswordChange} placeholder='Password' required />
          </div>

          <div className='login-button'>
            <button className='login-writeButton' type='submit' >
              Login
            </button>
            <Link to='/register'>
              <button className='login-reg-writeButton' type='button'>
                Register
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
