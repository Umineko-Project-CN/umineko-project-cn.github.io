import {
  animate,
  hover,
  motionValue,
  scroll,
  springValue,
  styleEffect,
  transformValue,
} from "motion";

function setupHeroSection() {
  const heroSection = document.getElementById("hero-section")!;
  const heroBg = document.getElementById("hero-bg")!;

  const mouseX = motionValue(0);
  const moveX = springValue(mouseX, { stiffness: 100, damping: 20 });

  styleEffect(heroBg, {
    transform: transformValue(() => `translateX(${moveX.get()}px)`),
  });

  function getMouseX(clientX: number) {
    const { left, width } = heroSection.getBoundingClientRect();
    const x = (clientX - left) / width - 0.5;
    return -x * 100;
  }

  heroSection.addEventListener("mousemove", (event) => {
    const x = getMouseX(event.clientX);
    mouseX.set(x);
  });

  hover(heroSection, (_, e) => {
    const x = getMouseX(e.clientX);
    animate(mouseX, [0, x], { duration: 0.5 });

    return () => {
      animate(mouseX, 0, { duration: 0.5 });
    };
  });
}

function setupTrailerSection() {
  const trailerSection = document.getElementById("trailer-section")!;
  const layers = trailerSection.querySelectorAll<HTMLElement>(".petals")!;

  layers.forEach((layer) => {
    const d = parseFloat(layer.dataset.speed || "0") * 100;
    scroll(animate(layer, { y: [`-${d}%`, `${d}%`] }, { ease: "linear" }), {
      target: trailerSection,
      offset: ["start end", "end start"],
    });
  });
}

setupHeroSection();
setupTrailerSection();
