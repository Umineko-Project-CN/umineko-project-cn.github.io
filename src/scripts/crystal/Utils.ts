import { type IShapeDrawData, getStyleFromHsl } from "@tsparticles/engine";
import type { CrystalParticle } from "./CrystalParticle";

/**
 * Generate crystal polygon points
 */
export function generateCrystalPolygon(
  points: number,
  irregularity: number,
  radius: number,
  aspect: number,
): { x: number; y: number }[] {
  const res: { x: number; y: number }[] = [];
  const angleStep = (Math.PI * 2) / points;

  for (let i = 0; i < points; i++) {
    const angle =
      i * angleStep + (Math.random() - 0.5) * angleStep * irregularity;
    const r = radius * (1 - Math.random() * irregularity * 0.5);
    res.push({
      x: Math.cos(angle) * r,
      y: Math.sin(angle) * r * aspect,
    });
  }

  return res;
}

/**
 * Draw crystal shape
 */
export function drawCrystal(data: IShapeDrawData<CrystalParticle>): void {
  const { context, particle, radius } = data;

  if (!particle.crystalPolygon) {
    const points = particle.crystalPoints ?? 5;
    const irregularity = particle.crystalIrregularity ?? 0.3;
    const aspect = particle.crystalAspect ?? 1.5;
    particle.crystalPolygon = generateCrystalPolygon(
      points,
      irregularity,
      radius,
      aspect,
    );
  }

  const polygon = particle.crystalPolygon;
  if (polygon.length < 3) return;

  context.beginPath();
  context.moveTo(polygon[0].x, polygon[0].y);
  for (let i = 1; i < polygon.length; i++) {
    context.lineTo(polygon[i].x, polygon[i].y);
  }
  context.closePath();

  // Create a subtle gradient for the crystal shard look
  const gradient = context.createLinearGradient(
    -radius,
    -radius,
    radius,
    radius,
  );

  const color = particle.getFillColor();
  const opacity = particle.opacity?.value ?? 0.8;

  if (color) {
    // Since particle.getFillColor() returned IHsl (according to previous error)
    gradient.addColorStop(0, getStyleFromHsl(color, opacity));

    // Darker version for the gradient end
    const darkerHsl = {
      h: color.h,
      s: color.s,
      l: Math.max(0, color.l - 20),
    };
    gradient.addColorStop(1, getStyleFromHsl(darkerHsl, opacity * 0.5));
  }

  context.fillStyle = gradient;
  context.fill();

  // Add highlighting edges for the "crystal" feel
  context.lineWidth = 1;
  context.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.3})`;
  context.stroke();

  // Internal "facet" lines for a more complex look
  context.beginPath();
  for (let i = 0; i < polygon.length; i++) {
    if (i % 2 === 0) {
      context.moveTo(0, 0);
      context.lineTo(polygon[i].x, polygon[i].y);
    }
  }
  context.strokeStyle = `rgba(255, 255, 255, ${opacity * 0.15})`;
  context.stroke();
}
