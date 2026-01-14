import type { IShapeValues, RangeValue } from "@tsparticles/engine";

export interface ICrystalData extends IShapeValues {
  points?: RangeValue;
  irregularity?: RangeValue;
  aspect?: RangeValue;
}
