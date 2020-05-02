import React from "react"
import Layout from '../components/layout';

export default () => {
    if("bluetooth" in navigator){
        return (
        
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