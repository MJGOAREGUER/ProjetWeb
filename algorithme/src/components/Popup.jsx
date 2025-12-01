import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

// --------------------------------------------------
// API globale utilisable hors React (ex: processor.js)
// --------------------------------------------------
export const PopupAPI = {
  showPopup: () => {
    console.warn(
      "PopupAPI.showPopup appelé avant l'initialisation du PopupProvider"
    );
  },
  closePopup: () => {
    console.warn(
      "PopupAPI.closePopup appelé avant l'initialisation du PopupProvider"
    );
  },
};

// --------------------------------------------------
// Contexte & Provider
// --------------------------------------------------
const PopupContext = createContext(null);

export function PopupProvider({ children }) {
  const [popup, setPopup] = useState({
    open: false,
    type: "info", // "success" | "error" | "warning" | "info"
    title: "",
    message: "",
    autoCloseMs: null,
  });

  const showPopup = (options = {}) => {
    setPopup({
      open: true,
      type: options.type || "info",
      title: options.title || "",
      message: options.message || "",
      autoCloseMs:
        typeof options.autoCloseMs === "number" ? options.autoCloseMs : 3000,
    });
  };

  const closePopup = () => {
    setPopup((prev) => ({ ...prev, open: false }));
  };

  // On branche l'API globale une fois le provider monté
  useEffect(() => {
    PopupAPI.showPopup = showPopup;
    PopupAPI.closePopup = closePopup;
  }, []);

  return (
    <PopupContext.Provider value={{ showPopup, closePopup }}>
      {children}

      <Popup
        open={popup.open}
        type={popup.type}
        title={popup.title}
        message={popup.message}
        autoCloseMs={popup.autoCloseMs}
        onClose={closePopup}
      />
    </PopupContext.Provider>
  );
}

// Hook pratique pour les composants React
export function usePopup() {
  return useContext(PopupContext);
}

// --------------------------------------------------
// Composant Popup générique
// --------------------------------------------------

const typeStyles = {
  success: "border-emerald-500 bg-emerald-950/90 text-emerald-100",
  error: "border-rose-500 bg-rose-950/90 text-rose-100",
  warning: "border-amber-500 bg-amber-950/90 text-amber-100",
  info: "border-sky-500 bg-sky-950/90 text-sky-100",
};

const positionStyles = {
  "top-right": "top-4 right-4 flex justify-end",
  "bottom-right": "bottom-4 right-4 flex justify-end",
  center: "inset-0 flex items-center justify-center",
  top: "top-4 inset-x-0 flex justify-center",
  bottom: "bottom-4 inset-x-0 flex justify-center",
};

function Popup({
  open,
  type = "info",
  title,
  message,
  onClose,
  autoCloseMs,
  position = "top-right",
}) {
  // Auto-fermeture
  useEffect(() => {
    if (!open || !autoCloseMs) return;
    const id = setTimeout(onClose, autoCloseMs);
    return () => clearTimeout(id);
  }, [open, autoCloseMs, onClose]);

  if (!open) return null;

  const typeClass = typeStyles[type] || typeStyles.info;
  const posClass = positionStyles[position] || positionStyles["top-right"];

  return (
    <div className={`fixed z-50 pointer-events-none ${posClass}`}>
      <div
        className={`pointer-events-auto rounded-lg border px-4 py-3 shadow-lg min-w-[260px] max-w-sm
                    backdrop-blur-sm ${typeClass}`}
        role="alert"
      >
        <div className="flex items-start gap-3">
          {/* petit indicateur circulaire */}
          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-current opacity-80" />

          <div className="flex-1">
            {title && (
              <h3 className="text-xs font-semibold tracking-wide uppercase">
                {title}
              </h3>
            )}
            {message && (
              <div className="mt-1 text-[12px] leading-snug whitespace-pre-line">
                {message}
              </div>
            )}
          </div>

          {/* bouton X */}
          <button
            onClick={onClose}
            className="ml-2 text-[11px] opacity-70 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  );
}

export default PopupProvider;