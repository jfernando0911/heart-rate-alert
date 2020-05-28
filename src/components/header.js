
import React, { useState, useEffect, useRef } from 'react';
import audio2 from '../../static/alert2.mp3';
import audio1 from '../../static/alert1.mp3';
import audio3 from '../../static/alert3.mp3';
import heart from '../heart.svg';
import styles from '../components/header.module.scss';
import Navbar from '../components/navbar';

export default () => {







    let db = useRef(null);

    useEffect(() => {



        let request = indexedDB.open("heart_rate_database", 1);


        request.onupgradeneeded = e => {
            db.current = e.target.result;
            console.log("onupgradeneeded: ", db.current);

            db.current.createObjectStore("heartRateLimits", { keyPath: "id", autoIncrement: true });

        }

        request.onsuccess = e => {
            db.current = e.target.result;


            let transaction = db.current.transaction("heartRateLimits", "readonly");
            let store = transaction.objectStore("heartRateLimits");
            let request = store.get(1);
            request.onsuccess = e => {
                let data = e.target.result;
                console.log("Data getting", data);
                let heartRateObject = e.target.result;
                // console.log(heartRateObject);
                if (heartRateObject === undefined) {
                    addData()
                } else {
                    setminHeartRate(data.minHeartRate);
                    setmaxHeartRate(data.maxHeartRate);
                }
            }
            request.onerror = e => {
                console.log("Error", e.target.errorCode);
            }


        }

        request.onerror = e => {
            console.log(e.target.errorCode);
        }


        const addData = () => {
            let tx = db.current.transaction(['heartRateLimits'], 'readwrite');
            let store = tx.objectStore('heartRateLimits');
            store.add({ minHeartRate: 136, maxHeartRate: 146 });

            let reqVals = store.get(1);

            reqVals.onsuccess = (e) => {
                console.log("Here: ", e.target.result);
                // let data = e.target.result;

            }

            reqVals.onerror = e => {
                console.log("Error: ", e.errorCode);
            }
        }



    }, []);




    const [minHeartRate, setminHeartRate] = useState(30);
    const [maxHeartRate, setmaxHeartRate] = useState(240);

    const [heartRate, setheartRate] = useState(0);
    const [bluetoothMessage, setbluetoothMessage] = useState("");
    const [heartState, setheartState] = useState(false);

    let notifications = useRef();
    const [buttonTextContent, setbuttonTextContent] = useState("Pair heart rate monitor");


    const audioref1 = useRef();
    const audioref2 = useRef();
    const audioref3 = useRef();


    useEffect(() => {

        if (heartRate < minHeartRate && heartRate > (minHeartRate - 2)) {     //menor al minHrRate y mayor a minHrate -2 | heartRate < 136 && heartRate > 134
            console.log("low -> Outside");
            setTimeout(() => {
                audioref1.current.play();
                console.log("low -> Inside")

            }, 5000);

        } else if (heartRate > minHeartRate && heartRate < maxHeartRate) { //heartRate > 136 && heartRate < 148
            console.log("In the middle -> Outside");
            setTimeout(() => {
                audioref3.current.play();
                console.log("Im in the middle -> Inside")

            }, 5000);

        }

        else if (heartRate > maxHeartRate && heartRate < (maxHeartRate + 2)) {                    //heartRate > 148
            console.log("Mayor")
            console.log("Mayor -> Outside");
            setTimeout(() => {
                audioref2.current.play();
                console.log("Mayor -> Inside")

            }, 5000);
        }

    }, [heartRate, maxHeartRate, minHeartRate]);



    async function connectBluetooth(e) {
        let options = {
            filters: [
                { services: ['heart_rate'] }
            ]
        }

        if(buttonTextContent === "Pair heart rate monitor"){
            
        try {
            let device = await navigator.bluetooth.requestDevice(options);
            console.log("Device requested: ", device);
            setbluetoothMessage("Requesting device...");
            let server = await device.gatt.connect();
            console.log("Connected to Gatt Server", server);
            setbluetoothMessage("Connecting to the Gatt Server...")
            let service = await server.getPrimaryService('heart_rate');
            console.log("Get heart rate service: ", service);
            setbluetoothMessage("Getting the heart rate service...")
            let characteristic = await service.getCharacteristic("heart_rate_measurement");
            setbluetoothMessage("Getting the heart rate measurement...");
            console.log(characteristic);
            notifications.current = await characteristic.startNotifications();
            if (notifications) {
                setbluetoothMessage("");
                setbuttonTextContent("Stop");
                setheartState(true);
            }

            console.log(notifications);
            notifications.current.addEventListener("characteristicvaluechanged", handleNotifications);
        } catch (error) {
            console.log("This error: ", error);
        }
        }else{
            onStopButtonClick();
        }

       

    }


    function handleNotifications(e) {
        setheartRate(parseHeartRate(e.currentTarget.value).heartRate);
        if (heartRate < 65) {
        } else if (heartRate > 65) {

        }

    }


    async function onStopButtonClick() {
        if (notifications.current) {
            try {
                await notifications.current.stopNotifications();
                console.log('> Notifications stopped');
                notifications.current.removeEventListener('characteristicvaluechanged',
                    handleNotifications);
                setheartRate(0);
                setheartState(false);
                setbuttonTextContent("Pair heart rate monitor");
            } catch (error) {
                console.log('Argh! ' + error);
            }
        }
    }

    function parseHeartRate(data) {
        const flags = data.getUint8(0);
        const rate16Bits = flags & 0x1;
        const result = {};
        let index = 1;
        if (rate16Bits) {
            result.heartRate = data.getUint16(index, /*littleEndian=*/true);
            index += 2;
        } else {
            result.heartRate = data.getUint8(index);
            index += 1;
        }
        const contactDetected = flags & 0x2;
        const contactSensorPresent = flags & 0x4;
        if (contactSensorPresent) {
            result.contactDetected = !!contactDetected;
        }
        const energyPresent = flags & 0x8;
        if (energyPresent) {
            result.energyExpended = data.getUint16(index, /*littleEndian=*/true);
            index += 2;
        }
        const rrIntervalPresent = flags & 0x10;
        if (rrIntervalPresent) {
            const rrIntervals = [];
            for (; index + 1 < data.byteLength; index += 2) {
                rrIntervals.push(data.getUint16(index, /*littleEndian=*/true));
            }
            result.rrIntervals = rrIntervals;
        }
        return result;
    }




    return (
        <header className={styles.headerContainer}>
            <Navbar />
            <button onClick={connectBluetooth} className={styles.pairStopButton}>{buttonTextContent}</button>


            <h1>Heart Rate</h1>
            <div className={styles.heartContainer}>
                <img src={heart} alt="heart" className={heartState ? styles.heart : styles.heartNone} style={{ animationDuration: 0.1 }} />
            </div>
            <p style={{ fontSize: 60 }}>{heartRate}</p>
            <p>{bluetoothMessage}</p>


            <audio /*controls*/ ref={audioref1}>
                <track kind="captions" />
                <source src={audio2} type="audio/mp3" />
            </audio>
            <audio /*controls*/ ref={audioref2}>
                <track kind="captions" />
                <source src={audio1} type="audio/mp3" />
            </audio>
            <audio /*controls*/ ref={audioref3}>
                <track kind="captions" />
                <source src={audio3} type="audio/mp3" />
            </audio>
            <div className={styles.heartRateLimitsContiner}>
                <div>
                    <p>minHR</p>
                    <p>{minHeartRate}</p>
                </div>
                <div>
                    <p>maxHR</p>
                    <p>{maxHeartRate}</p>

                </div>
            </div>


        </header>
    );
}


