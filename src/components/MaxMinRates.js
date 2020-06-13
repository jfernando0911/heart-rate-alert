import React from 'react';
import styles from '../components/maxMinRates.module.scss';

const maxMinRates = (props) => {
    console.log(props);
    return (
        <div className={styles.heartRateLimitsContiner}>
            <div>
                <p>minHR</p>
                <p>{props.minHRStorageSetting}</p>
            </div>
            <div>
                <p>maxHR</p>
                <p>{props.maxHRStorageSetting}</p>
            </div>

        </div>
    );
}

export default maxMinRates;
