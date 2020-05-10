import React from 'react';
import Header from '../components/header';
import styles from '../components/layout.module.scss'


export default ({ children }) => {

 


  return (

    <div /*className={darkMode ? styles.darkMode : styles.lightMode}*/ className={styles.container}>
     
      <Header/>
      {children}
     
    </div>
  )
}