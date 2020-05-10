import React from 'react';
import {Link} from 'gatsby';


const navbar = () => {
    return (
        <header>
            <nav style={{borderBottom: "1px solid black"}}>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/settings">Settings</Link></li>
                </ul>
            </nav>

        </header>
    );
}

export default navbar;
