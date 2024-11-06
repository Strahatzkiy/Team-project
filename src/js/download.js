import React from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

export const handleDownload = () => {
    const workspace = document.getElementById("workspace");
    const ignoreElements = document.getElementById("grid-diagram-ignore");
    const originalOpacity = ignoreElements.style.opacity;
    ignoreElements.style.opacity = '0';
    html2canvas(workspace).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, "diagram.png");
      });
    });
    ignoreElements.style.opacity = originalOpacity;
  };

  export default handleDownload;