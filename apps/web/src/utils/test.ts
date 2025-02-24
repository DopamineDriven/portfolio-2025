import { Fs } from "@d0paminedriven/fs";
import { list } from "@vercel/blob";
import * as dotenv from "dotenv";
import type { ListBlobResultBlob } from "@vercel/blob";

dotenv.config();
async function getResumeBlob() {
  const blobs = await list({ token: process.env.BLOB_READ_WRITE_TOKEN ?? "" });
  const resumeBlob = blobs.blobs.find(blob =>
    /resume-2025\.pdf/g.test(blob.pathname)
  );

  return resumeBlob satisfies ListBlobResultBlob | undefined;
}

export async function getResumeResultBlob() {
  try {
    const resumeBlob = await getResumeBlob();
    if (!resumeBlob) {
      throw new Error("Resume not found");
    }
    const fs = new Fs(process.cwd());

    fs.withWs(
      "src/utils/__generated__/resume-blob.ts",
      Buffer.from(
        Buffer.from(
          `export const resumeData = ${JSON.stringify(
            { resumeBlob: { id: "resume-2025", ...resumeBlob } },
            null,
            2
          )} as const;`
        ).toJSON().data
      )
    );
    return resumeBlob;
  } catch (error) {
    console.error("Error getting resume URL:", error);
    throw new Error("Failed to get resume download URL");
  }
}

getResumeResultBlob().catch(err => console.error(err));
// import {resumeBlob} from "./__generated__/resume-download-url.json" with {type: "json"};
// // prettier-ignore
// export const BufferIt = Buffer.from(Buffer.from(`<svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
// <g clip-path="url(#clip0_2912_1761)">
// <mask id="mask0_2912_1761" style="mask-type:luminance" maskUnits="userSpaceOnUse" x="0" y="0" width="512" height="512">
// <path d="M512 0H0V512H512V0Z" fill="white"/>
// </mask>
// <g mask="url(#mask0_2912_1761)">
// <path d="M498.527 256C498.527 122.056 389.944 13.4736 256.001 13.4736C122.057 13.4736 13.4746 122.056 13.4746 256C13.4746 389.943 122.057 498.526 256.001 498.526C389.944 498.526 498.527 389.943 498.527 256Z" stroke="black" stroke-width="2"/>
// <path d="M121.264 334.22L192.052 177.775H208.473L279.261 334.22H260.398L242.202 293.167H157.656L139.238 334.22H121.264ZM164.536 277.412H235.324L200.04 198.191L164.536 277.412Z" fill="black"/>
// <path d="M262.264 334.223V178.889H329.057C348.141 178.889 362.861 184.067 373.217 194.422C381.205 202.411 385.2 212.766 385.2 225.489C385.2 237.916 381.354 247.975 373.66 255.668C365.968 263.361 355.76 268.39 343.037 270.758L390.747 334.223H369.222L324.175 273.865H279.794V334.223H262.264ZM279.794 258.109H327.505C339.339 258.109 348.955 255.224 356.352 249.454C363.749 243.685 367.447 235.771 367.447 225.711C367.447 216.095 363.897 208.624 356.796 203.298C349.843 197.825 340.152 195.088 327.726 195.088H279.794V258.109Z" fill="black"/>
// </g>
// </g>
// <defs>
// <clipPath id="clip0_2912_1761">
// <rect width="512" height="512" fill="white"/>
// </clipPath>
// </defs>
// </svg>`, "utf-8").toJSON().data).toString("base64");

// const ffff = `data:image/svg+xml;base64, ${BufferIt}`;

// console.log(ffff);
