import React from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

export const handleDownload = () => {
    const workspace = document.getElementById("workspace");
    const ignoreElements = document.getElementsByClassName("diagram-ignore");
    var originalOpacity = new Array(ignoreElements.length);
    for (let i = 0; i < ignoreElements.length; i++) {
      originalOpacity[i] = ignoreElements[i].style.opacity;
      ignoreElements[i].style.opacity = '0';
    }
    html2canvas(workspace).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, "diagram.png");
      });
    });
    for (let i = 0; i < ignoreElements.length; i++) {
      ignoreElements[i].style.opacity = originalOpacity[i];
    }
  };

  export default handleDownload;