"use client";

import { useCallback, useState } from "react";

export function useDownloadResume(fileName = "resume.pdf") {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadResume = useCallback(() => {
    setIsDownloading(true);

    fetch(`/${fileName}`)
      .then(response => response.blob())
      .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
        window.URL.revokeObjectURL(url);
        setIsDownloading(false);
      })
      .catch(error => {
        console.error("Error downloading resume:", error);
        setIsDownloading(false);
      });
  }, [fileName]);

  return { downloadResume, isDownloading };
}
