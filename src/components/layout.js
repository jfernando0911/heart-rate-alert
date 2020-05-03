import React, {useRef} from 'react';
import styles from '../components/layout.module.scss';
import Header from '../components/header';
import audio2 from '../../static/alert2.mp3';
import audio1 from '../../static/alert1.mp3';


export default ({ children }) => {
  
  const audioref1 = useRef();
  const audioref2 = useRef();
  const playThis = ()=>{
    audioref1.current.play();
  }
  const playThis2 = ()=>{
    audioref2.current.play();
  }


  return(
  
    <div /*className={darkMode ? styles.darkMode : styles.lightMode}*/>
      <h1>Heart Rate:</h1>
      <Header /*saludo={getValue} *//>
      <p className={styles.heartEmoji}>❤</p>
      {children}
      <button onClick={playThis2}>Play Alert 1</button>
      <button onClick={playThis}>Play Alert 2</button>
      <audio /*controls*/ ref={audioref1}>
    <source src={audio2} type="audio/mp3" /> 
  </audio>
      <audio /*controls*/ ref={audioref2}>
    <source src={audio1} type="audio/mp3" /> 
  </audio>
      
    </div>
  )}