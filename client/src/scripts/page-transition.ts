import gsap from "gsap";

declare global {
  interface Window {
    navigateWithFade?: (href: string) => void;
    stopAudio?: () => void;
    playAudio?: (src: string) => void;
  }
}

// Global function to navigate with background image fade out
window.navigateWithFade = function (href: string): void {
  if (window.stopAudio) {
    window.stopAudio();
  }

  const bgImage = document.getElementById("bg-inner-image");
  const formElements = document.querySelectorAll<HTMLElement>(
    "[data-anim]:not(#bg-layer):not(#bg-inner-image)"
  );

  const tl = gsap.timeline();

  if (formElements.length > 0) {
    tl.to(formElements, {
      opacity: 0,
      x: 100,
      duration: 0.3,
      ease: "power2.inOut",
    });
  }

  if (bgImage) {
    tl.to(
      bgImage,
      {
        opacity: 0,
        duration: 0.5,
        ease: "power2.inOut",
      },
      "-=0.2"
    );
  }

  tl.call(() => {
    window.location.href = href;
  });
};

document.addEventListener("DOMContentLoaded", () => {
  document.addEventListener("click", (e: MouseEvent) => {
    const link = (e.target as HTMLElement).closest("a");
    if (
      !link ||
      link.target === "_blank" ||
      link.href.startsWith("mailto:") ||
      link.href.startsWith("tel:")
    ) {
      return;
    }

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
      return;
    }

    try {
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) {
        return;
      }
    } catch {
      return;
    }

    e.preventDefault();
    window.navigateWithFade?.(href);
  });
});
