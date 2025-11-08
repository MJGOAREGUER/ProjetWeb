import '../ressources/Calculator.css';

function Display({value}) {
    return (
    <div className="
  h-16 flex items-center justify-end px-4
  text-white text-3xl font-light tracking-tight
  bg-black/5 backdrop-blur-md
  mb-4
  rounded-lg
  shadow-[inset_0_0_6px_rgba(20,20,20,0.6)]
">
  {value}
</div>
    );
}

export default Display;
