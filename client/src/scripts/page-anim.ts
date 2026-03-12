import gsap from "gsap";

// Do nothing during SSR; only run in the browser
if (typeof window !== "undefined" && typeof document !== "undefined") {
  (function (): void {
    function hideForms(): void {
      const forms = document.querySelectorAll<HTMLElement>(
        "[data-anim]:not(#bg-layer):not(#bg-inner-image)"
      );
      forms.forEach((el) => {
        el.style.opacity = "0";
      });
    }

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", hideForms);
    } else {
      hideForms();
    }
  })();

  interface GsapFromToVars {
    opacity?: number;
    x?: number;
    y?: number;
    scale?: number;
    background?: string;
    visibility?: string;
    duration?: number;
    delay?: number;
    ease?: string;
  }

  window.addEventListener("DOMContentLoaded", () => {
    const elements = document.querySelectorAll<HTMLElement>("[data-anim]");

    const backgroundElements: HTMLElement[] = [];
    const formElements: HTMLElement[] = [];

    elements.forEach((el) => {
      if (el.id === "bg-layer" || el.id === "bg-inner-image") {
        backgroundElements.push(el);
      } else {
        formElements.push(el);
      }
    });

    backgroundElements.forEach((el) => {
      const type = el.dataset.anim;
      if (!type) return;

      const delay = parseFloat(el.dataset.delay ?? "0");
      const duration = parseFloat(el.dataset.duration ?? "1");

      let baseTo: GsapFromToVars = {
        opacity: 1,
        y: 0,
        x: 0,
        visibility: "visible",
        duration: duration || 1,
        delay,
        ease: "expo.out",
      };

      let from: GsapFromToVars = { opacity: 0, y: 16 };

      switch (type) {
        case "fade-in":
          break;
        case "slide-left":
          from = { opacity: 0, x: -100 };
          break;
        case "slide-right":
          from = { opacity: 0, x: 100 };
          break;
        case "slide-bottom-right":
          from = { opacity: 0, x: 100, y: 100 };
          break;
        case "slide-bottom-left":
          from = { opacity: 0, x: -100, y: 100 };
          break;
        case "slide-top-right":
          from = { opacity: 0, x: 550, y: -110 };
          break;
        case "zoom-in":
          from = { opacity: 0, scale: 1.2 };
          baseTo = { ...baseTo, scale: 1 };
          break;
        case "zoom-out":
          from = { opacity: 0, scale: 0.8, y: -50 };
          break;
        case "color":
          from = { background: "red" };
          break;
        case "color2":
          from = { background: "blue" };
          break;
        default:
          break;
      }

      gsap.fromTo(el, from, baseTo);
    });

    formElements.forEach((el) => {
      const type = el.dataset.anim;
      if (!type) return;

      const delay = parseFloat(el.dataset.delay ?? "0");
      const duration = parseFloat(el.dataset.duration ?? "1");
      const formDelay = delay + 0.3;

      let baseTo: GsapFromToVars = {
        opacity: 1,
        y: 0,
        x: 0,
        duration: duration || 1,
        delay: formDelay,
        ease: "expo.out",
      };

      let from: GsapFromToVars = { opacity: 0, y: 16 };

      switch (type) {
        case "fade-in":
          break;
        case "slide-left":
          from = { opacity: 0, x: -100 };
          break;
        case "slide-right":
          from = { opacity: 0, x: 100 };
          break;
        case "slide-bottom-right":
          from = { opacity: 0, x: 100, y: 100 };
          break;
        case "slide-bottom-left":
          from = { opacity: 0, x: -100, y: 100 };
          break;
        case "slide-top-right":
          from = { opacity: 0, x: 550, y: -110 };
          break;
        case "zoom-in":
          from = { opacity: 0, scale: 1.2 };
          baseTo = { ...baseTo, scale: 1 };
          break;
        case "zoom-out":
          from = { opacity: 0, scale: 0.8, y: -50 };
          break;
        case "color":
          from = { background: "red" };
          break;
        default:
          break;
      }

      gsap.fromTo(el, from, baseTo);
    });
  });
}
