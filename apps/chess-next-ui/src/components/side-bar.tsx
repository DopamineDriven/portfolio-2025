"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useDisclosure } from "@nextui-org/react";
import { IoHome, IoNewspaperOutline, IoSettingsOutline } from "react-icons/io5";
import { default as SettingsModal } from "./settings-modal";

const SideBar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [iconWidth, setIconWidth] = useState<number>(20);
  const pathname = usePathname();
  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 600) {
        setIconWidth(30);
      } else if (screenWidth < 960) {
        setIconWidth(32);
      } else {
        setIconWidth(20);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <>
      <aside
        id="sidebar"
        className="fixed left-0 top-0 z-40 h-screen w-36 -translate-x-[72%] transition-transform md:-translate-x-1/2 lg:translate-x-0"
        aria-label="Sidebar">
        <div className="h-full overflow-y-auto bg-slate-950 py-4">
          <Link
            href="/"
            className="mb-5 flex items-center justify-end px-1 sm:px-5 lg:justify-center">
            <Image
              src="/black-knight.svg"
              alt="Knightly Logo"
              width={28}
              height={28}
            />
            <span className="hidden self-center text-xl font-bold lg:block">
              Knightly
            </span>
          </Link>
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                href="/"
                className="group flex items-center justify-end py-4 text-white hover:bg-slate-900 sm:px-5 sm:py-2 lg:justify-center">
                <IoHome size={iconWidth} className="m-1 sm:m-0" />
                <span className="ms-3 hidden lg:block">Home</span>
              </Link>
            </li>
            <li>
              <a
                rel="noopener noreferrer"
                href="https://www.chess.com/today"
                target="_blank"
                className="group flex items-center justify-end py-4 text-white hover:bg-slate-900 sm:px-5 sm:py-2 lg:justify-center">
                <IoNewspaperOutline size={iconWidth} className="m-1 sm:m-0" />
                <span className="ms-3 hidden lg:block">News</span>
              </a>
            </li>
            <li>
              <Link
                shallow={true}
                href={pathname.startsWith("/") ? pathname : `/${pathname}`}
                onClick={e => {
                  e.preventDefault();
                  onOpen();
                }}
                className="group flex items-center justify-end py-4 text-white hover:bg-slate-900 sm:px-5 sm:py-2 lg:justify-center">
                <IoSettingsOutline size={iconWidth} className="m-1 sm:m-0" />
                <span className="ms-3 hidden lg:block">Settings</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
      <SettingsModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default SideBar;
