import Canvas from "./components/Canvas";
import Menu from "./components/Menu";
import { useState } from "react";

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  return (
    <div className="h-screen flex overflow-hidden">
      <Menu isOpen={isMenuOpen} toggleMenu={toggleMenu}/>
      <Canvas />
    </div>
  );
}

export default App;
