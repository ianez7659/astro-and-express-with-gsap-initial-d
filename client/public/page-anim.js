import gsap from "https://cdn.skypack.dev/gsap";

(function () {
  function hideForms() {
    var forms = document.querySelectorAll("[data-anim]:not(#bg-layer):not(#bg-inner-image)");
    forms.forEach(function (el) { el.style.opacity = "0"; });
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", hideForms);
  } else {
    hideForms();
  }
  window.addEventListener("DOMContentLoaded", function () {
    var elements = document.querySelectorAll("[data-anim]");
    var bg = [], form = [];
    elements.forEach(function (el) {
      if (el.id === "bg-layer" || el.id === "bg-inner-image") bg.push(el);
      else form.push(el);
    });
    function run(list, delayOff) {
      list.forEach(function (el) {
        var type = el.dataset.anim;
        if (!type) return;
        var delay = parseFloat(el.dataset.delay || "0");
        var duration = parseFloat(el.dataset.duration || "1");
        var baseTo = { opacity: 1, y: 0, x: 0, visibility: "visible", duration: duration || 1, delay: delay + (delayOff || 0), ease: "expo.out" };
        var from = { opacity: 0, y: 16 };
        switch (type) {
          case "slide-left": from = { opacity: 0, x: -100 }; break;
          case "slide-right": from = { opacity: 0, x: 100 }; break;
          case "slide-bottom-right": from = { opacity: 0, x: 100, y: 100 }; break;
          case "slide-bottom-left": from = { opacity: 0, x: -100, y: 100 }; break;
          case "slide-top-right": from = { opacity: 0, x: 550, y: -110 }; break;
          case "zoom-in": from = { opacity: 0, scale: 1.2 }; baseTo.scale = 1; break;
          case "zoom-out": from = { opacity: 0, scale: 0.8, y: -50 }; break;
          case "color": from = { background: "red" }; break;
          case "color2": from = { background: "blue" }; break;
        }
        gsap.fromTo(el, from, baseTo);
      });
    }
    run(bg, 0);
    run(form, 0.3);
  });
})();
