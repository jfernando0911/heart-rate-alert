
import React, { useState, useEffect } from 'react';

export default (props) => {



    const [heartRate, setheartRate] = useState(0);
    const [bluetoothMessage, setbluetoothMessage] = useState("");
   



    useEffect(() => {

        if (heartRate < 78) {
            console.log("low");
        } else {
            console.log("Mayor")
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
        <header>
            {/* <p> {darkMode ? "darkMode Enabled": "DarkMode Disabled" } </p>
            <button onClick={changeDarkMode}>ChangeMode</button>
        <button onClick={getValue}>Get a real value</button> */}
            <h1>Heart Rate Header</h1>
            <button onClick={connectBluetooth}>Bluetooth</button>
            <p style={{ fontSize: 60 }}>{heartRate}</p>
            <p>{bluetoothMessage}</p>

        </header>
    );
}


