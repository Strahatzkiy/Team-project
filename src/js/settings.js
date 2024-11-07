import React, { useEffect, useState } from 'react';
import {clearWorkspace} from "./clear.js"
import '../css/settings.css'; 
export const Settings = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
  const handleClearCache = () => {
   clearWorkspace();
  };

  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Настройки</h2>
        <button onClick={handleClearCache}>Удалить кэш</button>
        <button onClick={onClose}>Закрыть</button>
      </div>
    </div>
  );
};


export default Settings;