import type { FC } from "react";
import type { SVGProperties } from "@/types";

const BlackPawn: FC<SVGProperties> = ({ ...svg }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...svg}>
    <path
      d="M12 0.929688C10.2704 0.929688 8.86957 2.22932 8.86957 3.83389C8.86957 4.48007 9.09652 5.07544 9.48 5.56189C7.95391 6.37507 6.91304 7.89251 6.91304 9.64229C6.91304 11.1162 7.6487 12.4303 8.79913 13.2943C6.4513 14.0639 3 17.3239 3 23.0742H21C21 17.3239 17.5487 14.0639 15.2009 13.2943C16.3513 12.4303 17.087 11.1162 17.087 9.64229C17.087 7.89251 16.0461 6.37507 14.52 5.56189C14.9035 5.07544 15.1304 4.48007 15.1304 3.83389C15.1304 2.22932 13.7296 0.929688 12 0.929688Z"
      fill="black"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

BlackPawn.displayName = "BlackPawn";

export default BlackPawn;
