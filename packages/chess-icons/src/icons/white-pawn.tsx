import type { FC } from "react";
import type { SVGProperties } from "@/types";

const WhitePawn: FC<SVGProperties> = ({ ...svg }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...svg}>
    <path
      d="M12.4798 1C10.8195 1 9.47463 2.29115 9.47463 3.88525C9.47463 4.52721 9.69251 5.11869 10.0606 5.60197C8.5956 6.40984 7.59637 7.91738 7.59637 9.65574C7.59637 11.12 8.30259 12.4256 9.40701 13.2839C7.1531 14.0485 3.83984 17.2872 3.83984 23H21.1198C21.1198 17.2872 17.8066 14.0485 15.5527 13.2839C16.6571 12.4256 17.3633 11.12 17.3633 9.65574C17.3633 7.91738 16.3641 6.40984 14.899 5.60197C15.2672 5.11869 15.4851 4.52721 15.4851 3.88525C15.4851 2.29115 14.1402 1 12.4798 1Z"
      fill="white"
      stroke="black"
      strokeLinecap="round"
    />
  </svg>
);

WhitePawn.displayName = "WhitePawn";

export default WhitePawn;
