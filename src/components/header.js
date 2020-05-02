import React, {useState, useEffect} from 'react';


export default (props) => {

    // let getItem = localStorage.getItem();
    const [darkMode, setdarkMode] = useState(JSON.parse(localStorage.getItem("darkModeValue")) || false);

    useEffect(() => {
        localStorage.setItem("darkModeValue", JSON.stringify(darkMode));
        props.saludo(darkMode);
      }, [darkMode]);

    const changeDarkMode = (event)=>{
        setdarkMode(!darkMode);
    }

    const getValue = ()=>{
        let getItem = JSON.parse(localStorage.getItem("darkModeValue"));
        console.log("Value", getItem);   
    }



    return (
        <header>
            <p> {darkMode ? "darkMode Enabled": "DarkMode Disabled" } </p>
            <button onClick={changeDarkMode}>ChangeMode</button>
            <button onClick={getValue}>Get a real value</button>


        </header>
    );
}

 
