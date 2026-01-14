import {
  type Container,
  type IShapeDrawData,
  type IShapeDrawer,
  getRangeValue,
} from "@tsparticles/engine";
import { drawCrystal, generateCrystalPolygon } from "./Utils";
import type { CrystalParticle } from "./CrystalParticle";
import type { ICrystalData } from "./ICrystalData";

const defaultPoints = 6;
const defaultIrregularity = 0.5;
const defaultAspect = 1.0;

export class CrystalDrawer implements IShapeDrawer<CrystalParticle> {
  readonly validTypes = ["crystal"] as const;

  draw(data: IShapeDrawData<CrystalParticle>): void {
    drawCrystal(data);
  }

  particleInit(container: Container, particle: CrystalParticle): void {
    const shapeData = particle.shapeData as ICrystalData | undefined;

    const points = Math.floor(
      getRangeValue(shapeData?.points ?? defaultPoints),
    );
    const irregularity = getRangeValue(
      shapeData?.irregularity ?? defaultIrregularity,
    );
    const aspect = getRangeValue(shapeData?.aspect ?? defaultAspect);

    particle.crystalPoints = points;
    particle.crystalIrregularity = irregularity;
    particle.crystalAspect = aspect;

    // Generate polygon points for this particle
    const radius = particle.size?.value ?? 50;
    particle.crystalPolygon = generateCrystalPolygon(
      points,
      irregularity,
      radius,
      aspect,
    );
  }
}
