"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/ui/atoms/button";
import { resumeData } from "@/utils/__generated__/resume-blob";

export function DownloadResumeButton() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);

      // Create a temporary link and trigger the download
      const link = document.createElement("a");
      link.href = resumeData.resumeBlob.downloadUrl;
      link.target = "_blank";
      link.download = "andrew-ross-resume.pdf"; // This will be the suggested filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading resume:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <motion.div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        scale: isHovered ? 1.025 : 1
      }}
      transition={{
        duration: 0.2,
        ease: "easeInOut"
      }}>
      <Button
        onClick={handleDownload}
        disabled={isDownloading}
        className="relative">
        <Download
          className={`mr-2 h-4 w-4 ${isDownloading ? "animate-spin" : ""}`}
        />
        {isDownloading ? "Downloading..." : "Download Resume"}

        {isHovered && (
          <motion.div
            className="bg-primary/10 absolute inset-0 -z-10 rounded-md"
            layoutId="download-button-highlight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </Button>
    </motion.div>
  );
}
