import Swiper from "swiper";
import { Mousewheel } from "swiper/modules";
import { effectVirtualTransitionEnd } from "swiper/effect-utils";
import {
  motionValue,
  mapValue,
  transformValue,
  styleEffect,
  type MotionValue,
} from "motion";

function setupBackground(p: MotionValue<number>) {
  const backgroundHero = document.getElementById("backgroundHero")!;
  const backgroundMain = document.getElementById("backgroundMain")!;

  const rotation = mapValue(p, [1, 2, 3], [-10, 15, -20]);
  const color = mapValue(
    p,
    [1, 2, 3],
    ["rgb(100,128,154)", "rgb(138,121,97)", "rgb(63,41,45)"],
  );

  styleEffect(backgroundMain, {
    "--frame-rotation": transformValue(() => `${rotation.get()}deg`),
    "--filter-color": color,
    "--petals-top": transformValue(() => (p.get() - 1) / 2),
  });

  p.on("change", (v: number) => {
    if (v < 0) {
      backgroundHero.classList.remove("hidden");
      backgroundMain.classList.add("hidden");
    } else {
      backgroundHero.classList.add("hidden");
      backgroundMain.classList.remove("hidden");
    }
  });
}

function setupHeader(p: MotionValue<number>) {
  const headerHero = document.getElementById("headerHero")!;
  const headerMain = document.getElementById("headerMain")!;
  const title = document.getElementById("title")!;
  const subtitle = document.getElementById("subtitle")!;

  p.on("change", (v: number) => {
    if (v < 0) {
      headerHero.classList.remove("hidden");
      headerMain.classList.add("hidden");
      headerMain.classList.remove("flex");
    } else {
      headerHero.classList.add("hidden");
      headerMain.classList.remove("hidden");
      headerMain.classList.add("flex");
    }

    if (v <= 1.5) {
      title.textContent = "介绍";
      subtitle.textContent = "INTRODUCTION";
    } else if (v <= 2.5) {
      title.textContent = "剧本";
      subtitle.textContent = "SCENARIOS";
    } else if (v <= 3.5) {
      title.textContent = "特色";
      subtitle.textContent = "FEATURES";
    }
  });
}

function setupFooter(p: MotionValue<number>) {
  const footer = document.getElementById("footer")!;

  p.on("change", (v: number) => {
    if (v < 0) {
      footer.classList.remove("square:flex");
    } else {
      footer.classList.add("square:flex");
    }
  });
}

function setupCover(p: MotionValue<number>, d: MotionValue<number>) {
  const cover = document.getElementById("cover")!;

  const opacity = mapValue(p, [-1, 0, 1], [1, 1, 0]);
  const top = mapValue(p, [-1, 0, 1], ["120%", "0%", "0%"]);

  styleEffect(cover, {
    opacity,
    top,
    transitionDuration: transformValue(() => `${d.get()}ms`),
  });
}

function setupImageModal(src: MotionValue<string>) {
  const img = document.querySelector<HTMLImageElement>("#imageModal img")!;
  src.on("change", (v: string) => (img.src = v));
}

function setupNavigation(swiper: Swiper) {
  const nav = document.querySelector("nav")!;
  const menuBanner = document.getElementById("menuBanner")!;
  const menuItems = nav.querySelectorAll("button[role='menuitem']")!;

  menuBanner.addEventListener("click", () => swiper.slideTo(0));
  menuItems.forEach((menuItem, index) => {
    menuItem.addEventListener("click", () => swiper.slideTo(index + 2));
  });
}

function setupFeaturesSection(imageSrc: MotionValue<string>) {
  const popups = document.querySelectorAll("[data-popup-img]")!;

  popups.forEach((popup) => {
    const imageUrl = popup.getAttribute("data-popup-img")!;
    popup.addEventListener("click", () => imageSrc.set(imageUrl));
  });
}

function setupSwiper(
  progress: MotionValue<number>,
  duration: MotionValue<number>,
) {
  interface ISwiperSlide extends HTMLElement {
    swiperSlideOffset: number;
    progress: number;
  }

  const mainSwiper = document.getElementById("mainSwiper")!;
  const dummy = document.getElementById("dummy") as ISwiperSlide;

  let scrollDirection: "next" | "prev" | null;

  return new Swiper(".swiper", {
    direction: "vertical",
    modules: [Mousewheel],
    mousewheel: {
      enabled: true,
      forceToAxis: true,
    },
    speed: 600,
    effect: "custom",
    watchSlidesProgress: true,
    virtualTranslate: true,
    on: {
      scroll(_, event) {
        scrollDirection = event.deltaY > 0 ? "next" : "prev";
      },
      touchEnd() {
        scrollDirection = null;
      },
      transitionEnd(swiper) {
        if (dummy.progress === 0) {
          const direction = scrollDirection || swiper.swipeDirection;
          setTimeout(() => {
            if (direction === "next") swiper.slideNext();
            else swiper.slidePrev();
          }, 100);
        }
      },
      setTranslate(swiper) {
        const slides = swiper.slides as ISwiperSlide[];

        slides.forEach((el) => {
          const slide = el as ISwiperSlide;
          el.style.transform = `translate3d(0px, ${-slide.swiperSlideOffset}px, 0px)`;
        });

        const p = dummy.progress;

        if (p < 0) {
          slides[0].style.opacity = "1";
        } else if (p > 0) {
          slides[0].style.opacity = "0";
        }
        slides.slice(1).forEach((el) => {
          const absOffset = Math.abs(el.progress);
          el.style.opacity = `${Math.max(1 - absOffset, 0)}`;
        });

        progress.set(p);
      },
      setTransition(swiper, d) {
        const slides = swiper.slides;

        slides.slice(1).forEach((el) => {
          el.style.transitionDuration = `${d}ms`;
        });

        effectVirtualTransitionEnd({
          swiper,
          duration: d,
          transformElements: slides,
          allSlides: true,
        });

        mainSwiper.style.setProperty("--transition-duration", `${d}ms`);
        duration.set(d);
      },
    },
  });
}

const progress = motionValue(-1);
const duration = motionValue(600);
const imageSrc = motionValue("");

const filteredProgress = transformValue(() => {
  const pv = progress.getPrevious() ?? -1;
  const v = progress.get();
  return v === 0 ? pv : v;
});

setupBackground(filteredProgress);
setupHeader(filteredProgress);
setupFooter(filteredProgress);
setupCover(progress, duration);
setupImageModal(imageSrc);
setupFeaturesSection(imageSrc);

const swiper = setupSwiper(progress, duration);

setupNavigation(swiper);
