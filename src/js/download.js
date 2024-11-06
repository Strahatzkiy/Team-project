import React from "react";
import html2canvas from "html2canvas";
import { saveAs } from "file-saver";

export const handleDownload = () => {
    const workspace = document.getElementById("workspace");
    html2canvas(workspace).then((canvas) => {
      canvas.toBlob((blob) => {
        saveAs(blob, "diagram.png");
      });
    });
  };

  export default handleDownload;