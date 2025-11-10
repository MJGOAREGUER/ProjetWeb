import "../ressources/index.css";

function Menu({isOpen, toggleMenu}){
    return(
        <nav className={`
            bg-slate-700 text-white h-full transition-all duration-300 flex flex-col
            ${isOpen ? "w-64": "w-14"}
            `}
        >
            <button
                onClick={toggleMenu}
                className="p-2 hover:bg-slate-500 text-center"
            >
                {isOpen ? "←" : "→"}
            </button>
        </nav>
    );
}

export default Menu;