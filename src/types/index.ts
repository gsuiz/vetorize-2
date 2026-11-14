export type Vector = [x: number, y: number];

export type Matrix = Vector[];

export interface Transformation {
  rotation: number | null;
  scale: { sx: number; sy: number } | null;
  reflection: string | null;
  anchor: [x: number, y: number] | null;
};

export interface Reta {
  a: number;
  b: number;
}

export type Mode = "transformation" | "triangle" | "regression";
export type ModeTitle = "Transformações" | "Área do Triângulo" | "Regressão linear";