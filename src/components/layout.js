import React from 'react';
import Header from '../components/header';
import styles from '../components/layout.module.scss'

export default ({ children }) => {
  
  

  return(
  
    <div /*className={darkMode ? styles.darkMode : styles.lightMode}*/ className={styles.container}>
      {/* <h1>Heart Rate:</h1> */}
      <Header /*saludo={getValue} *//>
      {children}
     
    </div>
  )}