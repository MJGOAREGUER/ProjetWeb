import './../ressources/Calculator.css';
import { evaluateExpression } from '../lib/calc';
import {useState, useEffect, useCallback} from "react";
import Display from './Display'
import Keypad from './Keypad';

const operator = "+-/*^%()";

function Calculator(){
    const [display, setDisplay] = useState("0");

    const addDigit = useCallback((d) => {
        setDisplay(prev => (prev === "0" ? d : prev + d));
    }, []);

    const addOperator = useCallback((op) => {
        setDisplay(prev => prev + op);
    }, []);

    function onOperator(o){
        addOperator(o);
    }

    function onDigit(d){
        addDigit(d);
    }

    const onEquals = useCallback(() => {
        try{
            setDisplay(prev => String(evaluateExpression(prev)));
        } catch {
            setDisplay("Error");
        }
    }, []);

    const onRemove = useCallback(() => {
        setDisplay(prev => (prev.length === 1 ? "0" : prev.slice(0, -1)));
    }, []);

    useEffect(() => {
        function handleKey(e){
            if (e.key >= '0' && e.key <= '9'){
                addDigit(e.key);
            }else if(operator.includes(e.key)){
                addOperator(e.key);
            }else if(e.key === "Enter" || e.key === "NumpadEnter"){
                onEquals();
            }else if(e.key === '.') {
                addDigit('.');
            }else if (e.key === "Backspace"){
                onRemove();
            }else if (e.key === "Escape"){
                setDisplay('0');
            }
        }

        window.addEventListener("keydown", handleKey);

        return () => {
            window.removeEventListener("keydown", handleKey);
        }
    }, [addDigit, addOperator, onEquals, onRemove]);


    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <Display value={display}/>
            <Keypad onDigit={onDigit} onOperator={onOperator} onEquals={onEquals}/>
        </div>
    );
}

export default Calculator;