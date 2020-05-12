import React from 'react';
import {Link} from 'gatsby';
import styles from '../components/navbar.module.scss';


const navbar = () => {
    return (
        <header className={styles.headerContainer}>
            <nav className={styles.navContainer}>
                <ul className={styles.ulContainer}>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                </ul>
            </nav>

        </header>
    );
}

export default navbar;
