import React, {useState} from "react"
import Layout from '../components/layout';
// import styles from '../pages/index.module.scss'
import Header from '../components/header';

export default () => {

   


    if("bluetooth" in navigator){
        return (
            // Detect when someone inputs data, before showing up the heartbeats and rages.
            <div>
                <Layout />
            </div>)
    }else{
        return (
        
            <div>
               <h1>Your browser is not compatible with bluetooth</h1>
            </div>)
        
    }
    
    

}