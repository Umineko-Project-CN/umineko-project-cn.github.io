import type { Particle } from "@tsparticles/engine";

export type CrystalParticle = Particle & {
  crystalPoints?: number;
  crystalIrregularity?: number;
  crystalAspect?: number;
  crystalPolygon?: { x: number; y: number }[];
};
