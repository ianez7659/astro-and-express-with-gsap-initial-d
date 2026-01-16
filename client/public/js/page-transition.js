import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.12.2/index.js";

// Global function to navigate with background image fade out
window.navigateWithFade = function(href) {
  // Stop current audio before navigation
  if (window.stopAudio) {
    window.stopAudio();
  }
  
  const bgImage = document.getElementById("bg-inner-image");
  const formElements = document.querySelectorAll('[data-anim]:not(#bg-layer):not(#bg-inner-image)');

  // Create timeline for coordinated animation
  const tl = gsap.timeline();

  // Slide out form elements to the right
  if (formElements.length > 0) {
    tl.to(formElements, {
      opacity: 0,
      x: 100,
      duration: 0.3,
      ease: "power2.inOut"
    });
  }

  // Fade out background image
  if (bgImage) {
    tl.to(bgImage, {
      opacity: 0,
      duration: 0.5,
      ease: "power2.inOut"
    }, "-=0.2"); // Start slightly before form fade completes
  }

  // Navigate after animation completes
  tl.call(() => {
    window.location.href = href;
  });
};

// Handle page transitions with background fade out
document.addEventListener("DOMContentLoaded", () => {
  // Intercept all link clicks
  document.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (!link || link.target === "_blank" || link.href.startsWith("mailto:") || link.href.startsWith("tel:")) {
      return;
    }

    const href = link.getAttribute("href");
    if (!href || href.startsWith("#") || href.startsWith("javascript:")) {
      return;
    }

    // Check if it's an internal link
    try {
      const url = new URL(href, window.location.origin);
      if (url.origin !== window.location.origin) {
        return; // External link, don't intercept
      }
    } catch {
      return; // Invalid URL
    }

    e.preventDefault();
    window.navigateWithFade(href);
  });
});

