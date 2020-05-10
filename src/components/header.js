
import React, { useState, useEffect, useRef } from 'react';
import audio2 from '../../static/alert2.mp3';
import audio1 from '../../static/alert1.mp3';
import audio3 from '../../static/alert3.mp3';
import heart from '../heart.svg';
import styles from '../components/header.module.scss';

export default (props) => {


    let db;


    const [minHeartRate, setminHeartRate] = useState(30);
    const [maxHeartRate, setmaxHeartRate] = useState(240);

    useEffect(() => {

        let request = indexedDB.open("heart_rate_database", 1);


        request.onupgradeneeded = e => {
            db = e.target.result;
            console.log("onupgradeneeded: ", db);

            db.createObjectStore("heartRateLimits", { keyPath: "id", autoIncrement: true });

        }

        request.onsuccess = e => {
            db = e.target.result;


            let transaction = db.transaction("heartRateLimits", "readonly");
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
            let tx = db.transaction(['heartRateLimits'], 'readwrite');
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





    const [heartRate, setheartRate] = useState(0);
    const [bluetoothMessage, setbluetoothMessage] = useState("");
    const [heartState, setheartState] = useState(false);

    const audioref1 = useRef();
    const audioref2 = useRef();
    const audioref3 = useRef();


    useEffect((minHeartRate, maxHeartRate, heartRate) => {

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

    }, [heartRate]);



    async function connectBluetooth() {
        let options = {
            filters: [
                { services: ['heart_rate'] }
            ]
        }

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
            let notifications = await characteristic.startNotifications();
            if (notifications) {
                setbluetoothMessage("");
                setheartState(true);
            }

            console.log(notifications);
            notifications.addEventListener("characteristicvaluechanged", handleNotifications);
        } catch (error) {
            console.log("This error: ", error);
        }
    }


    function handleNotifications(e) {
        // console.log(parseHeartRate(e.currentTarget.value).heartRate);
        setheartRate(parseHeartRate(e.currentTarget.value).heartRate);
        // navigator.vibrate(200);
        if (heartRate < 65) {
            // setvoice("Lower");
            // window.speechSyntesis.text(voice);
            // window.speechSyntesis.speak(speechSyntesis);
            // msg.text ="lower";

        } else if (heartRate > 65) {

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

    // const getProps = () => {    Testing porpuses
    //     console.log(typeof props.minHrValue);
    //     const converted = parseInt(props.minHrValue);
    //     console.log("Converted...", converted);
    //     console.log(parseInt(props.maxHrValue));
    //     console.log("Getting min value from parent: ", props.minHrValue);
    //     console.log("Getting max value from parent:", props.maxHrValue);

    // }


    return (
        <header className={styles.headerContainer}>
            <button onClick={connectBluetooth}>Pair heart rate monitor</button>

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

            <p>minHR</p>
            <p>{minHeartRate}</p>
            <p>maxHR</p>
            <p>{maxHeartRate}</p>

            {/* <button onClick={getProps}>Get props</button> */}

        </header>
    );
}


