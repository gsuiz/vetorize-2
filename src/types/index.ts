import type { Data, Layout, Config } from "plotly.js"
import { JSX } from "react"

export type Vector = [x: number, y: number];

export type Matrix = Vector[];

export interface Transformation {
  rotation: number | null;
  scale: { sx: number; sy: number } | null;
  reflection: string | null;
  anchor: [x: number, y: number] | null;
};

export interface LinearRegressionCoefficients {
  slope: number;
  intercept: number;
}

export type Mode = "transformation" | "triangles" | "regression";
export type ModeTitle = "Transformações" | "Área do Triângulo" | "Regressão linear";

export type ModeMap = Record<
  Mode,
  { title: ModeTitle; component: JSX.Element; chart: JSX.Element }
>;


export interface FigureState {
  data: Data[];
  layout: Partial<Layout>;
  config?: Partial<Config>;
}