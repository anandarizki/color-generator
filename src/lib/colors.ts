//Check if a color is dark

import chroma from "chroma-js";
import { randomItem } from "./utils";

export type ColorHarmony =
  | "monochromatic"
  | "analogous"
  | "complementary"
  | "split-complementary"
  | "triadic"
  | "tetradic";

export type ColorStrength =
  | "pastel"
  | "vibrant"
  | "muted"
  | "dark"
  | "neutral"
  | "contrast";

export const colorHarmonyList: ColorHarmony[] = [
  "monochromatic",
  "analogous",
  "complementary",
  "split-complementary",
  "triadic",
  "tetradic",
];
export const colorStrengthList: ColorStrength[] = [
  "pastel",
  "vibrant",
  "muted",
  "dark",
  "neutral",
  "contrast",
];
export function isDark(color: string): boolean {
  const [r, g, b] = chroma(color).rgb();
  const brightness = 0.299 * r + 0.587 * g + 0.114 * b;
  return brightness < 140;
}

export function hexToRgb(hex: string): [number, number, number] {
  const [r, g, b] = chroma(hex).rgb();
  return [r, g, b];
}

export function hexToHsl(hex: string): [number, number, number] {
  const [h, s, l] = chroma(hex).hsl();
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h: number, s: number, l: number): string {
  return chroma.hsl(h, s / 100, l / 100).hex();
}

export function toHex(color: string) {
  try {
    return chroma(color).hex();
  } catch (e) {
    throw new Error(`Invalid color format: ${color}`);
  }
}

const rgbStr = (hex: string) => {
  const [r, g, b] = hexToRgb(hex);
  return `${r},${g},${b}`;
};

const hslStr = (hex: string) => {
  const [h, s, l] = hexToHsl(hex);
  return `${h},${s},${l}`;
};

export const colorStr = (
  hex: string,
  format: "hex" | "rgb" | "hsl"
): string => {
  const strByFormat = {
    hex,
    rgb: rgbStr(hex),
    hsl: hslStr(hex),
  };
  return strByFormat[format];
};

function applyStrength(h: number, s: number, l: number, str: ColorStrength) {
  const hslByStrength: Record<ColorStrength, [number, number, number]> = {
    pastel: [h, Math.max(20, s - 30), Math.min(95, l + 15)],
    vibrant: [h, Math.min(100, s + 25), Math.max(40, Math.min(60, l))],
    muted: [h, Math.max(10, s - 20), Math.max(40, l - 5)],
    dark: [h, Math.min(100, s + 10), Math.max(5, l - 30)],
    neutral: [h, Math.max(30, s - 10), Math.min(45, l - 5)],
    contrast: [h, Math.min(100, s + 30), Math.min(90, 100 - l)],
  };

  return hslByStrength[str];
}

const harmonyOffsets: Record<ColorHarmony, number[]> = {
  monochromatic: [0],
  // Wider spread with finer steps for smoother analogues
  analogous: [-60, -45, -30, -15, 0, 15, 30, 45, 60],
  complementary: [0, 180],
  "split-complementary": [0, 150, 210],
  triadic: [0, 120, 240],
  tetradic: [0, 90, 180, 270],
};

function generateColors(
  count: number,
  base: string[],
  strength: ColorStrength,
  offsets: number[]
): string[] {
  const colors = new Set(base);
  const baseH = base.length
    ? hexToHsl(randomItem(base))[0]
    : Math.random() * 360;

  let attempts = 0;

  while (colors.size < count && attempts < 1000) {
    const offset = randomItem(offsets);
    const [h, s, l] = applyStrength(
      baseH + offset,
      50 + Math.random() * 40,
      45 + Math.random() * 20,
      strength
    );
    colors.add(hslToHex(h, s, l));
    attempts++;
  }
  return Array.from(colors);
}

export function getColorPalette(
  harmony: ColorHarmony,
  strength: ColorStrength,
  length: number,
  base: string[]
): string[] {
  if (harmony === "monochromatic") {
    //Ensure the hex output is unique
    const colors = new Set(base);
    const [baseH, baseS] = base.length
      ? hexToHsl(base[0])
      : [Math.random() * 360, 60 + Math.random() * 30];

    let attempts = 0; //circuit breaker

    while (colors.size < length && attempts < 1000) {
      const [h, s, l] = applyStrength(
        baseH,
        baseS + (Math.random() - 0.5) * 20,
        20 + Math.random() * 60,
        strength
      );
      colors.add(hslToHex(h, s, l));
      attempts++;
    }
    return Array.from(colors);
  }

  return generateColors(length, base, strength, harmonyOffsets[harmony]);
}

export function getBestColor(
  harmony: ColorHarmony,
  strength: ColorStrength,
  length: number,
  base: string[]
): string {
  const generated = getColorPalette(harmony, strength, length, base);
  return generated.pop() || "#CCCCCC";
}
