import React, { useRef, useState } from 'react';
import Header from '../components/header';
import styles from '../components/layout.module.scss'


export default ({ children }) => {

  const [minHR, setminHR] = useState(0);
  const [maxHR, setmaxHR] = useState(0);
  const [errorMessageHR, seterrorMessageHR] = useState("");

  const refMinHr = useRef();
  const refMaxHr = useRef();
  // refMinHr.current.value= 30;
  // refMaxHr.current.value= 40;


  const saveHrValues = () => {
    console.log("This is the min heart rate value:", refMinHr.current.value);
    console.log("This is the max heart rate value:", refMaxHr.current.value);
    console.log(refMinHr.current);
    console.log(refMaxHr.current);

    if (refMinHr.current.value > refMaxHr.current.value) {
      seterrorMessageHR("Your min heart rate value cant be less than your high heart rate value, please enter new values...");

    } else {
      setminHR(refMinHr.current.value);
      setmaxHR(refMaxHr.current.value);
      seterrorMessageHR("");
    }
  }




  return (

    <div /*className={darkMode ? styles.darkMode : styles.lightMode}*/ className={styles.container}>
      {/* <h1>Heart Rate:</h1> */}
      <Header /*saludo={getValue} */ minHrValue={minHR} maxHrValue={maxHR} />
      {children}
      <div className={styles.heartRateTemporalContainer}>
        <p>Min HR</p>
        <input type="number" min={30} max={240} mobile="auto" ref={refMinHr} />
        <p>Max HR</p>
        <input type="number" min={30} max={240} mobile="auto" ref={refMaxHr} />
        <p>{errorMessageHR}</p>
        <button onClick={saveHrValues}>Save</button>

      </div>
    </div>
  )
}