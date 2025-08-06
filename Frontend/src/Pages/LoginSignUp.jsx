import React from 'react'
import './CSS/LoginSignUp.css'
import { useState } from 'react'

// Define backend URL directly
const backendUrl = 'https://ecommerce-3ufe.onrender.com';

const LoginSignUp = () => {

  const [state,setstate] = useState("Login");
  const [formData,setFormdata] = useState({    // State variable to save from data
    username: "",
    password: "",
    email: ""
  })

  const changeHandler = (e)=>{
      setFormdata({...formData,[e.target.name]:e.target.value})
  }

  const login = async () =>{
      console.log("Login function executed",formData);
      let responseData;
      await fetch(`${backendUrl}/login`,{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      }).then((response)=>response.json()).then((data)=>responseData=data)

      if(responseData.success){
        localStorage.setItem('auth-token',responseData.token); //auth token saved in local storage
        window.location.replace("/"); //Sending user to home page
      }
      else{
        alert(responseData.errors);
      }
      
  }

  const signup = async () =>{
      console.log("Signup function executed",formData);
      let responseData;
      await fetch(`${backendUrl}/signup`,{
        method:'POST',
        headers:{
          Accept:'application/form-data',
          'Content-Type':'application/json',
        },
        body: JSON.stringify(formData),
      }).then((response)=>response.json()).then((data)=>responseData=data)

      if(responseData.success){
        localStorage.setItem('auth-token',responseData.token); //auth token saved in local storage
        window.location.replace("/"); //Sending user to home page
      }
      else{
        alert(responseData.errors);
      }
  }

  return (
    <div className='loginsignup'>
      <div className="loginsignup-container">
        <h1>{state}</h1>
        <div className="loginsignup-fields">
          {state==="Sign Up"?<input name='username' value={formData.username} onChange={changeHandler} type="text" placeholder='Your Name' />:<></>}
          <input name='email' value={formData.email} onChange={changeHandler} type="email" placeholder='Email Address' />
          <input name='password' value={formData.password} onChange={changeHandler} type="password" placeholder='Password' />
        </div>
        <button onClick={()=>{state==="Login"?login():signup()}}>Continue</button>
        <p className="loginsignup-login">Already have an account? <span onClick={()=>{setstate("Login")}}>Login here</span></p>
        <div className="loginsignup-agree">
          <input type="checkbox" name='' id='' />
          <p>By continuing, i agree to the terms of use & privacy policy.</p>
        </div>
      </div>
    </div>
  )
}

export default LoginSignUp
