import { tsParticles } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { CrystalDrawer } from "./crystal/CrystalDrawer";
import {
  animate,
  motionValue,
  mapValue,
  springValue,
  transformValue,
  styleEffect,
  hover,
} from "motion";

async function setupTsParticles(
  dustContainer: HTMLElement,
  crystalContainer: HTMLElement,
) {
  // Load tsparticles
  await loadSlim(tsParticles);

  // Load dust particles
  await tsParticles.load({
    element: dustContainer,
    options: {
      autoPlay: true,
      detectRetina: true,
      fpsLimit: 60,
      particles: {
        color: {
          value: [
            "rgba(226, 232, 240, 0.15)",
            "rgba(129, 140, 248, 0.1)",
            "rgba(216, 180, 254, 0.08)",
          ],
        },
        move: {
          enable: true,
          speed: { min: 0.05, max: 0.3 },
          outModes: "out",
        },
        number: {
          value: 100,
          density: { enable: true, width: 1920, height: 1080 },
        },
        opacity: {
          value: { min: 0.05, max: 0.25 },
          animation: {
            enable: true,
            speed: { min: 0.5, max: 1 },
          },
        },
        shape: { type: "circle" },
        size: {
          value: { min: 0.8, max: 3 },
          animation: { enable: true, speed: 3 },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "bubble" },
        },
        modes: {
          bubble: { distance: 200, size: 3, duration: 1, opacity: 0.8 },
        },
      },
    },
  });

  // Add custom crystal shape
  await tsParticles.addShape(new CrystalDrawer(), true);

  await tsParticles.load({
    element: crystalContainer,
    options: {
      autoPlay: true,
      detectRetina: true,
      fpsLimit: 60,
      particles: {
        color: {
          value: [
            "rgba(226, 232, 240, 0.3)",
            "rgba(129, 140, 248, 0.25)",
            "rgba(216, 180, 254, 0.2)",
            "rgba(255, 255, 255, 0.3)",
            "rgba(191, 219, 254, 0.2)",
          ],
        },
        move: {
          enable: true,
          speed: { min: 0.1, max: 0.2 },
          outModes: "out",
        },
        number: {
          value: 30,
          density: { enable: true, width: 1920, height: 1080 },
        },
        opacity: {
          value: { min: 0.1, max: 0.4 },
          animation: { enable: true, speed: 0.2 },
        },
        shape: {
          type: "crystal",
          options: {
            crystal: {
              points: { min: 6, max: 9 },
              irregularity: { min: 0.3, max: 0.8 },
              aspect: { min: 0.9, max: 2.5 },
            },
          },
        },
        size: {
          value: { min: 12, max: 80 },
        },
        rotate: {
          value: { min: 0, max: 360 },
          animation: {
            enable: true,
            speed: { min: 0.5, max: 1 },
          },
        },
      },
    },
  });
}

function setupCrystalFragment(crystal: HTMLElement) {
  const aurora = crystal.querySelector(".aurora-effect")!;
  const container = crystal.querySelector(".crystal-container")!;
  const highlight = crystal.querySelector(".highlight-layer")!;
  const background = crystal.querySelector(".crystal-background")!;
  const content = crystal.querySelector(".crystal-content")!;

  const x = motionValue(0);
  const y = motionValue(0);
  const mouseX = springValue(x, { stiffness: 100, damping: 20 });
  const mouseY = springValue(y, { stiffness: 100, damping: 20 });

  // Highlight
  const highlightGradient = transformValue(() => {
    const hx = mouseX.get();
    const hy = mouseY.get();
    return `radial-gradient(circle at ${hx}% ${hy}%, rgba(255,255,255,0.2) 0%, transparent 70%)`;
  });

  styleEffect(highlight, {
    background: highlightGradient,
  });

  // Crystal
  const rotateX = mapValue(mouseY, [0, 100], [15, -15]);
  const rotateY = mapValue(mouseX, [0, 100], [-15, 15]);
  const floatY = motionValue(0);

  animate(floatY, [-25, 25, -25], {
    duration: 14,
    repeat: Infinity,
    ease: "easeInOut",
  }).time = Math.random() * 14;

  styleEffect(container, {
    rotateX: rotateX,
    rotateY: rotateY,
    y: floatY,
  });

  hover(container, () => {
    animate(
      aurora,
      {
        opacity: [0, 1, 0.5, 1],
        scale: [0.8, 1.2, 1.0, 1.5, 0.8],
      },
      {
        opacity: { duration: 0.6 },
        scale: { duration: 10, repeat: Infinity, ease: "easeInOut" },
      },
    );

    animate(
      background,
      {
        opacity: 1,
        scale: 1.05,
        filter: "blur(0px)",
        maskImage: "radial-gradient(circle,white 0%,transparent 70%)",
      },
      { duration: 0.6, ease: "easeOut" },
    );

    animate(content, { opacity: 0.7, filter: "blur(0px)" }, { duration: 0.6 });

    return () => {
      // Reset
      x.set(0);
      y.set(0);

      animate(aurora, { opacity: 0, scale: 0.5 }, { duration: 0.6 });

      animate(
        background,
        {
          opacity: 0.6,
          scale: 1,
          filter: "blur(2px)",
          maskImage: "radial-gradient(circle,white 0%,transparent 70%)",
        },
        { duration: 0.6, ease: "easeOut" },
      );

      animate(content, { opacity: 0, filter: "blur(2px)" }, { duration: 0.6 });
    };
  });

  container.addEventListener("mousemove", (e) => {
    const mouseEvent = e as MouseEvent;
    const rect = container.getBoundingClientRect();
    x.set(((mouseEvent.clientX - rect.left) / rect.width) * 100);
    y.set(((mouseEvent.clientY - rect.top) / rect.height) * 100);
  });
}

function setupLoadingMask(mask: HTMLElement) {
  window.addEventListener("load", () => {
    mask.classList.add("opacity-0");
    setTimeout(() => {
      mask.style.display = "none";
    }, 1000);
  });
}

const dustContainer = document.getElementById("dust-particles")!;
const crystalContainer = document.getElementById("crystal-particles")!;
const portCrystal = document.getElementById("crystal-port")!;
const sakuCrystal = document.getElementById("crystal-saku")!;
const loadingMask = document.getElementById("home-mask")!;
setupTsParticles(dustContainer, crystalContainer);
setupCrystalFragment(portCrystal);
setupCrystalFragment(sakuCrystal);
setupLoadingMask(loadingMask);
