import type { FC } from "react";
import type { SVGProperties } from "@/types";

const BlackKing: FC<SVGProperties> = ({ ...svg }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...svg}>
    <path
      d="M12.0195 4.68372V1"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12.0211 13.4356C12.0211 13.4356 14.9954 8.52834 14.004 6.56544C14.004 6.56544 13.343 4.92969 12.0211 4.92969C10.6992 4.92969 10.0383 6.56544 10.0383 6.56544C9.04684 8.52834 12.0211 13.4356 12.0211 13.4356Z"
      fill="black"
      stroke="black"
      strokeWidth="1.5"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.74966 21.2854C8.38489 23.5755 14.9944 23.5755 18.6296 21.2854V16.7053C18.6296 16.7053 24.5782 13.761 22.5953 9.83518C19.9515 5.58222 13.6725 7.54512 12.0201 12.4524C9.70679 7.54512 3.42776 5.58222 1.44491 9.83518C-0.537947 13.761 4.74966 16.3782 4.74966 16.3782V21.2854Z"
      fill="black"
    />
    <path
      d="M12.0201 12.4524C13.6725 7.54512 19.9515 5.58222 22.5953 9.83518C24.5782 13.761 18.6296 16.7053 18.6296 16.7053V21.2854C14.9944 23.5755 8.38489 23.5755 4.74966 21.2854V16.3782C4.74966 16.3782 -0.537947 13.761 1.44491 9.83518C3.42776 5.58222 9.70679 7.54512 12.0201 12.4524ZM12.0201 12.4524V14.7424"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.3672 2.3125H13.6719"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M18.2992 16.3753C18.2992 16.3753 23.9173 13.7581 22.2848 10.0613C19.7203 6.23362 13.6726 8.85082 12.0202 13.1038M12.0202 13.1038L12.0268 14.4778M12.0202 13.1038C10.3678 8.85082 3.6962 6.23362 1.77349 10.0613C0.123097 13.7581 5.3285 16.3753 5.3285 16.3753"
      stroke="white"
      strokeWidth="0.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.75 16.7066C8.38523 14.7436 14.9947 14.7436 18.63 16.7066M4.75 18.9966C8.38523 17.0337 14.9947 17.0337 18.63 18.9966M4.75 21.2867C8.38523 19.3238 14.9947 19.3238 18.63 21.2867"
      stroke="white"
      strokeWidth="0.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

BlackKing.displayName = "BlackKing";

export default BlackKing;
