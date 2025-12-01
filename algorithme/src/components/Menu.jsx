import "../ressources/index.css";
import CorpusIcon from "../ressources/images/corpus.png";
import MatrixIcon from "../ressources/images/matrix.png";
import AutocompletionIcon from "../ressources/images/autocompletion.png";

function Menu({ isOpen, toggleMenu, onAddCorpus, onAddMatrix, onAddAutocompletion }) {
  return (
    <>
      {/* BOUTON TOGGLE */}
      <button
        onClick={toggleMenu}
        className={`bg-transparent w-8 h-8 fixed top-2 left-3 z-[3] rounded text-white flex items-center justify-center
        `}
      >
        {isOpen ? "×" : "→"}
      </button>

      {/* MENU LATERAL */}
      <nav
        className={`
          fixed top-0 left-0 h-screen bg-slate-800 text-white shadow-md shadow-black
          transition-all duration-100 flex flex-col z-[2]
          ${isOpen ? "w-40" : "w-16"}
        `}
      >
        {/* TITRE DE SECTION */}
        <div className="mt-4 px-3 ml-10 mb-5">
          <p
            className={`
              text-xs font-semibold tracking-wide text-slate-300
              transition-opacity duration-200 whitespace-nowrap
              ${isOpen ? "opacity-100" : "opacity-0"}
            `}
          >
            Ajout de node
          </p>
        </div>

        {/* BOUTONS D'AJOUT */}
        <div className="flex flex-col gap-2 px-2">
          {/* CORPUS */}
          <div className="relative group">
            <button
              className={`
                bg-transparent hover:bg-slate-600 rounded-md px-2 py-2 w-full
                flex items-center ${isOpen ? "": "justify-center"} gap-2
                transition-colors
              `}
              onClick={onAddCorpus}
            >
              <img
                src={CorpusIcon}
                alt="Corpus"
                className="w-6 h-6 shrink-0"
              />
              <span
                className={`
                  text-sm
                  ${isOpen ? "inline" : "hidden"}
                `}
              >
                Corpus
              </span>
            </button>
            
            {!isOpen && (
              <span
                className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2
                           whitespace-nowrap bg-slate-900 text-white text-xs px-2 py-1 rounded
                           opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow lg"
              >
                Ajouter un corpus
              </span>
            )}
          </div>

          {/* MATRIX */}
          <div className="relative group">
            <button
              className={`
                bg-transparent hover:bg-slate-600 rounded-md px-2 py-2 w-full
                flex items-center ${isOpen ? "": "justify-center"} gap-2
                transition-colors
              `}
              onClick={onAddMatrix}
            >
              <img
                src={MatrixIcon}
                alt="Matrix"
                className="w-6 h-6 shrink-0"
              />
              <span
                className={`
                  text-sm
                  ${isOpen ? "inline" : "hidden"}
                `}
              >
                Matrix
              </span>
            </button>
            
            {!isOpen && (
              <span
                className="pointer-events-none absolute left-10 top-1/2 -translate-y-1/2 ml-2
                           whitespace-nowrap bg-slate-900 text-white text-xs px-2 py-1 rounded
                           opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow lg"
              >
                Ajouter un matrice de réprésentation
              </span>
            )}

          </div>
          
          {/* AUTOCOMPLETION */}
          <div className="relative group">
            <button
              className={`
                bg-transparent hover:bg-slate-600 rounded-md px-2 py-2 w-full
                flex items-center ${isOpen ? "": "justify-center"} gap-2
                transition-colors
              `}
              onClick={onAddAutocompletion}
            >
              <img
                src={AutocompletionIcon}
                alt="Autocompletion"
                className="w-6 h-6 shrink-0"
              />
              <span
                className={`
                  text-sm
                  ${isOpen ? "inline" : "hidden"}
                `}
              >
                Autocompletion
              </span>
            </button>

            {!isOpen && (
              <span
                className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 ml-2
                           whitespace-nowrap bg-slate-900 text-white text-xs px-2 py-1 rounded
                           opacity-0 group-hover:opacity-100 transition-opacity duration-150 shadow lg"
              >
                Ajouter un module d'autocompletion
              </span>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default Menu;
