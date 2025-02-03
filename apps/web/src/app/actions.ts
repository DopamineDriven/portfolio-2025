"use server";

import { list } from "@vercel/blob";

async function getResumeDownloadUrl() {
  // eslint-disable-next-line
  const blobs = await list({ token: process.env.BLOB_READ_WRITE_TOKEN ?? "" });
  const resumeBlob = blobs.blobs.find(blob =>
    /resume-2025\.pdf/g.test(blob.pathname)
  );
  return resumeBlob?.downloadUrl;
}

export async function getResumeUrl() {
  try {
    const downloadUrl = await getResumeDownloadUrl();
    if (!downloadUrl) {
      throw new Error("Resume not found");
    }
    return downloadUrl;
  } catch (error) {
    console.error("Error getting resume URL:", error);
    throw new Error("Failed to get resume download URL");
  }
}
