import "./Calculator.css";

function Keypad({onDigit}){
    return(
        <div class="grid grid-cols-4 gap-4">
            <button onClick={() => onDigit("7")}>7</button>
            <button onClick={() => onDigit("8")}>8</button>
            <button onClick={() => onDigit("9")}>9</button>
            <button onClick={() => onDigit("0")}>+</button>
            <button onClick={() => onDigit("4")}>4</button>
            <button onClick={() => onDigit("5")}>5</button>
            <button onClick={() => onDigit("6")}>6</button>
            <button onClick={() => onDigit("7")}>-</button>
            <button onClick={() => onDigit("1")}>1</button>
            <button onClick={() => onDigit("2")}>2</button>
            <button onClick={() => onDigit("3")}>3</button>
            <button onClick={() => onDigit("7")}>x</button>
            <button onClick={() => onDigit("4")}>0</button>
            <button onClick={() => onDigit("7")}>.</button>
            <button onClick={() => onDigit("7")}>/</button>
            <button onClick={() => onDigit("7")}>=</button>
        </div>
    );
}

export default Keypad;