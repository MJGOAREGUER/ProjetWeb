// Menu.jsx
import "../ressources/index.css";

function Menu({ isOpen, toggleMenu, onAddCorpus, onAddMatrix }) {
  return (
    <>
      <button
        onClick={toggleMenu}
        className={`bg-slate-600 w-8 h-8 fixed top-2 left-2 z-[3] rounded text-white ${
          isOpen ? "" : "shadow-[0_0_6px_rgba(120,120,120,0.5)]"
        }`}
      >
        {isOpen ? "x" : "→"}
      </button>

      <nav
        className={`
          bg-slate-600 text-white h-screen shadow-md shadow-white transition-all duration-300 flex flex-col z-[2]
          ${isOpen ? "w-32" : "w-0"}
        `}
      >
        {isOpen && (
          <div className="mt-10 flex flex-col gap-2 px-2">
            <button
              className="bg-slate-500 rounded px-2 py-1 text-sm hover:bg-slate-400"
              onClick={onAddCorpus}
            >
              + Corpus
            </button>
            <button
              className="bg-slate-500 rounded px-2 py-1 text-sm hover:bg-slate-400"
              onClick={onAddMatrix}
            >
              + Matrix
            </button>
          </div>
        )}
      </nav>
    </>
  );
}

export default Menu;
