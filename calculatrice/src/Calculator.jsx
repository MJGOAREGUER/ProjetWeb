import './Calculator.css';
import {useState, useEffect} from "react";
import Display from './Display'
import Keypad from './Keypad';

function Calculator(){
    const [display, setDisplay] = useState("0");

    function addDigit(d) {
        setDisplay(prev => (prev === "0" ? d : prev + d));
    }

    function onDigit(d){
        addDigit(d);
    }
    
    useEffect(() => {
        function handleKey(e){
            if (e.key >= "0" && e.key <= "9"){
                addDigit(e.key);
            }
        }

        window.addEventListener("keydown", handleKey);

        return () => {
            window.removeEventListener("keydown", handleKey);
        }
    }, []);


    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <Display value={display}/>
            <Keypad onDigit={onDigit}/>
        </div>
    );
}

export default Calculator;