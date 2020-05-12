import React from "react"
import Layout from '../components/layout'
import { Helmet } from "react-helmet"
// import Navbar from '../components/navbar';

export default () => {




    return (
        // Detect when someone inputs data, before showing up the heartbeats and rages.
        <div>
           

            <Helmet>
                <meta charSet="utf-8" />
                
                <title>Heart Rate Alert</title>
                <link rel="canonical" href="https://heart-rate-alert.surge.sh/" />
                <html lang="en" />
            </Helmet>

            <Layout />
        </div>)

}



