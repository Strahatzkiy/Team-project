import "../css/diagram_idef0.css";
import { HeaderContainer, RightbarContainer } from "./containers.js";
import { WorkspaceContainer } from "./workspace.js";

// Главная функция
export const Idef0 = () => {
  document.title = 'Диаграмма Idef0';
  return (
    <>
      <div className="grid">
        <HeaderContainer />
        <WorkspaceContainer />
        <RightbarContainer />
      </div>
    </>
  );
}

export default Idef0;
