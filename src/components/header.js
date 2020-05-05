
import React, { useState, useEffect, useRef } from 'react';
import audio2 from '../../static/alert2.mp3';
import audio1 from '../../static/alert1.mp3';
import audio3 from '../../static/alert3.mp3';
import heart from '../heart.svg';
import styles from '../components/header.module.scss'


export default (props) => {



    const [heartRate, setheartRate] = useState(0);
    const [bluetoothMessage, setbluetoothMessage] = useState("");
    const [heartState, setheartState] = useState(false);

    const audioref1 = useRef();
    const audioref2 = useRef();
    const audioref3 = useRef();


    useEffect(() => {

        if (heartRate < 65) {
            console.log("low -> Outside");
            setTimeout(() => {
                audioref1.current.play();
                console.log("low -> Inside")

            }, 5000);

        } else if (heartRate > 65 && heartRate < 70) {
            console.log("In the middle -> Outside");
            setTimeout(() => {
                audioref3.current.play();
                console.log("Im in the middle -> Inside")

            }, 5000);

        }

        else if (heartRate > 70) {
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




    return (
        <header className={styles.headerContainer}>
            <h1>Heart Rate:</h1>
            <button onClick={connectBluetooth}>Bluetooth</button>

            <div className={styles.heartContainer}>
                <img src={heart} alt="heart" className={heartState?  styles.heart : styles.heartNone } style={{animationDuration:0.1}} />
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


        </header>
    );
}


