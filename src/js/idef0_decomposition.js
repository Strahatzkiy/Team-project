import "../css/diagram_idef0.css";
import { HeaderContainer, RightbarContainer } from "./containers.js";
import { WorkspaceContainerDec } from "./workspace.js";

// Главная функция
export const Idef0Dec = () => {
  document.title = 'Диаграмма Idef0';
  return (
    <>
      <div className="grid">
        <HeaderContainer />
        <WorkspaceContainerDec />
        <RightbarContainer />
      </div>
    </>
  );
}

export default Idef0Dec;
