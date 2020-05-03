import React, { useState, useEffect } from 'react';
import styles from '../components/layout.module.scss';
import Header from '../components/header';

export default ({ children }) => {
  
  // const [darkMode, setdarkMode] = useState(JSON.parse(localStorage.getItem("darkModeValue")) || false);
  // const [value, setvalue] = useState("Hello from Parent");


  // const getValue = (val)=>{
  //   if(val === true){
  //     setdarkMode(true);
  //   }else{
  //     setdarkMode(false);
  //   }
  // }
  

  return(
  
    <div /*className={darkMode ? styles.darkMode : styles.lightMode}*/>
      <h1>Heart Rate:</h1>
      <Header /*saludo={getValue} *//>
      <p className={styles.heartEmoji}>❤</p>
      {children}
    </div>
  )}