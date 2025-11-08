import "../ressources/Calculator.css";

const baseBtn = `
  flex items-center justify-center
  h-12 rounded-lg
  backdrop-blur-md
  text-white font-medium
  transition
  shadow-[inset_0_0_3px_rgba(20,20,20,0.6)]
  hover:bg-white/20 hover:shadow-[0_0_8px_0px_rgba(200,200,200,0.3)]
  active:scale-[0.98]
`;

const numBtn = `${baseBtn} text-lg`;
const opBtn  = `${baseBtn} text-xl bg-orange-400/50 hover:bg-orange-400/80`;
const actBtn = `${baseBtn} text-sm uppercase tracking-wide`;
const delBtn = `${baseBtn} text-sm uppercase tracking-wide bg-red-500/50 hover:bg-red-500/80`;

function Keypad({ onDigit, onOperator, onEquals, onDelete, onClear, onSquare }) {
  return (
    <div className="grid grid-cols-4 gap-1.5">
      <button className={`${actBtn} bg-blue-400/50 hover:bg-blue-400/80`} onClick={() => onClear()}>AC</button>
      <button className={actBtn} onClick={() => onOperator('%')}>%</button>
      <button className={actBtn} onClick={() => onOperator('^')}>EXP</button>
      <button className={delBtn} onClick={() => onDelete()}>DEL</button>

      <button className={actBtn} onClick={() => onOperator("(")}>(</button>
      <button className={actBtn} onClick={() => onOperator(")")}>)</button>
      <button
        className={actBtn}
        onClick={() => {
            onOperator('^');
            onDigit('2');
            onEquals();
        }}
      >
        x²
      </button>
      <button className={opBtn} onClick={() => onOperator("/")}>÷</button>

      <button className={numBtn} onClick={() => onDigit("7")}>7</button>
      <button className={numBtn} onClick={() => onDigit("8")}>8</button>
      <button className={numBtn} onClick={() => onDigit("9")}>9</button>
      <button className={opBtn}  onClick={() => onOperator("*")}>×</button>

      <button className={numBtn} onClick={() => onDigit("4")}>4</button>
      <button className={numBtn} onClick={() => onDigit("5")}>5</button>
      <button className={numBtn} onClick={() => onDigit("6")}>6</button>
      <button className={opBtn}  onClick={() => onOperator("-")}>−</button>

      <button className={numBtn} onClick={() => onDigit("1")}>1</button>
      <button className={numBtn} onClick={() => onDigit("2")}>2</button>
      <button className={numBtn} onClick={() => onDigit("3")}>3</button>
      <button className={opBtn}  onClick={() => onOperator("+")}>+</button>

      <button className={numBtn} onClick={() => onDigit("0")}>0</button>
      <button className={numBtn} onClick={() => onDigit(".")}>.</button>
      <button
        className={`${baseBtn} col-span-2 text-lg bg-green-500/50 hover:bg-green-500/80`}
        onClick={() => onEquals()}
      >
        =
      </button>
    </div>
  );
}

export default Keypad;
