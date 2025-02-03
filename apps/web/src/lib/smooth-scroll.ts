"use client";

export function smoothScroll(elementId: string) {
  const element = document.getElementById(elementId);
  if (element) {
    const header = document.querySelector("header");
    const headerHeight = header ? header.offsetHeight : 0;
    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerHeight - 20; // 20px extra offset

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }
}
