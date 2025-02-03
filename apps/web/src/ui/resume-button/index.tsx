"use client";

import type { FC } from "react";
import Link from "next/link";
import { FileDown } from "lucide-react";

interface ResumeButtonProps {
  className?: string;
}

const ResumeButton: FC<ResumeButtonProps> = ({ className = "" }) => {
  return (
    <Link
      href="/resume.pdf"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-white transition-colors duration-200 hover:bg-blue-700 ${className}`}>
      <FileDown className="mr-2 h-5 w-5" />
      Download Resume
    </Link>
  );
};

export default ResumeButton;
