import React, { useRef, useEffect } from 'react';
import styles from '../components/settings.module.scss';


const SettingsContainer = () => {

    let inputMinHeartRateVal = useRef(0);
    let inputMaxHeartRateVal = useRef(0);

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
            let tx = db.current.transaction(['heartRateLimits'], 'readonly');
            let store = tx.objectStore('heartRateLimits');
            let req = store.get(1);

            console.log("Hello here");
            req.onsuccess = e => {
                let heartRateObject = e.target.result;
                // console.log(heartRateObject);
                if (heartRateObject === undefined) {
                    addData()
                } else {
                    inputMinHeartRateVal.current.value = heartRateObject.minHeartRate;
                    inputMaxHeartRateVal.current.value = heartRateObject.maxHeartRate;
                }


            }

            req.onerror = e => {
                console.log("Error: ", e.errorCode);
            }



        }

        request.onerror = e => {
            db.current = e.target.result;
            console.log("Error", e.target.errorCode);
        }

        const addData = () => {
            let tx = db.current.transaction(['heartRateLimits'], 'readwrite');
            let store = tx.objectStore('heartRateLimits');
            store.add({ minHeartRate: 136, maxHeartRate: 146 });

            let reqVals = store.get(1);

            reqVals.onsuccess = (e) => {
                console.log("Here: ", e.target.result);
                let data = e.target.result;
                inputMinHeartRateVal.current.value = data.minHeartRate;
                inputMaxHeartRateVal.current.value = data.maxHeartRate;
            }

            reqVals.onerror = e => {
                console.log("Error: ", e.errorCode);
            }
        }



    }, []);




    // const saveHeartRateLimits = () => {
    //     let tx = db.transaction(['heartRateLimits'], 'readonly');
    //     let store = tx.objectStore('heartRateLimits');

    //     let req = store.get(1);

    //     req.onsuccess = function (event) {
    //         let note = event.target.result;
    //         if (note) {
    //             console.log(note);
    //         } else {
    //             console.log("note 1 not found")
    //         }
    //     }

    //     req.onerror = function (event) {
    //         console.log('Error: ' + event.target.errorCode);
    //     }

    // }



    const saveData = () => {
        console.log(inputMinHeartRateVal.current.value);
        console.log(inputMaxHeartRateVal.current.value);


        let objectStore = db.current.transaction(['heartRateLimits'], "readwrite").objectStore('heartRateLimits');

        // Get the to-do list object that has this title as it's title
        let objectStoreTitleRequest = objectStore.get(1);

        objectStoreTitleRequest.onsuccess = function () {
            // Grab the data object returned as the result
            let data = objectStoreTitleRequest.result;

            // Update heartRateValue
            data.minHeartRate = parseInt(inputMinHeartRateVal.current.value);
            data.maxHeartRate = parseInt(inputMaxHeartRateVal.current.value);

            // Create another request that inserts the item back into the database
            let request = objectStore.put(data);

            // Log the transaction that originated this request


            // When this new request succeeds, run the displayData() function again to update the display
            request.onsuccess = function () {
                console.log("New data added");
            };
            request.onerror = function (e) {
                console.log("Error", e.target.errorCode);
            };
        };
    }


    return (
        <div>
            <h2>Set heart rate limit values</h2>
            <div className={styles.settingsContainer}>
                <p>Min HR</p>
                <input type="number" min={30} max={240} ref={inputMinHeartRateVal} />
                <p>Max HR</p>
                <input type="number" min={30} max={240} ref={inputMaxHeartRateVal} />
                <br />
                <br />
                <button onClick={saveData}>Save</button>
            </div>

        </div>
    );
}

export default SettingsContainer;
