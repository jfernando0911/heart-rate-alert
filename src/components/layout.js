import React from 'react';
import styles from '../components/layout.module.scss';

export default ({ children }) => {
  
  // console.log("Hola mundo");
  // "bluetooth" in navigator ? console.log("It's compatible"): console.log("Web api bluetooth is not compatible");
  
 


  return(
  
    <div>
      <h1>Hello world</h1>
      <p className={styles.heartEmoji}>❤</p>
      {children}
    </div>
  )}