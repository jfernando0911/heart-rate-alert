import React from 'react';
import Header from '../components/header';


export default ({ children }) => {
  
  

  return(
  
    <div /*className={darkMode ? styles.darkMode : styles.lightMode}*/>
      <h1>Heart Rate:</h1>
      <Header /*saludo={getValue} *//>
      {children}
     
    </div>
  )}