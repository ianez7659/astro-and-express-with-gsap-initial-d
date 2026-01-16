import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/index.js";

// Hide form elements immediately (before DOMContentLoaded)
(function() {
  function hideForms() {
    const forms = document.querySelectorAll('[data-anim]:not(#bg-layer):not(#bg-inner-image)');
    forms.forEach(el => {
      el.style.opacity = '0';
    });
  }
  
  // Run immediately if DOM is already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideForms);
  } else {
    hideForms();
  }
})();

window.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll("[data-anim]");
  
  // Separate background and form elements
  const backgroundElements = [];
  const formElements = [];
  
  elements.forEach((el) => {
    if (el.id === 'bg-layer' || el.id === 'bg-inner-image') {
      backgroundElements.push(el);
    } else {
      formElements.push(el);
    }
  });

  // Animate background elements first
  backgroundElements.forEach((el) => {
    const type = el.dataset.anim;
    if (!type) return; // Skip if no animation type
    
    const delay = parseFloat(el.dataset.delay || "0");
    const duration = parseFloat(el.dataset.duration || "1");

    let baseTo = {
      opacity: 1,
      y: 0,
      x: 0,
      visibility: "visible",
      duration: duration || 1,
      delay,
      ease: "expo.out",
    };

    let from = { opacity: 0, y: 16 };

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
    }
    
    gsap.fromTo(el, from, baseTo);
  });

  // Animate form elements after background (with additional delay)
  formElements.forEach((el) => {
    const type = el.dataset.anim;
    if (!type) return;
    
    const delay = parseFloat(el.dataset.delay || "0");
    const duration = parseFloat(el.dataset.duration || "1");
    
    // Add extra delay to ensure background animation starts first
    const formDelay = delay + 0.3;

    let baseTo = {
      opacity: 1,
      y: 0,
      x: 0,
      duration: duration || 1,
      delay: formDelay,
      ease: "expo.out",
    };

    let from = { opacity: 0, y: 16 };

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
    }
    
    gsap.fromTo(el, from, baseTo);
  });
});
