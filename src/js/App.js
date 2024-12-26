import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Menu } from "./menu.js";
import { Idef0 } from "./diagram_idef0.js";
import { Idef0Dec } from "./idef0_decomposition.js";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/diagram/idef0" element={<Idef0 />} />
        <Route path="/diagram/idef0/a0" element={<Idef0Dec />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;