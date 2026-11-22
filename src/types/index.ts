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

export interface RegressionCoefficients {
  slope: number;
  intercept: number;
  curvature: number | null
}


export type Mode = "transformation" | "triangles" | "regression";
export type ModeTitle = "Transformações" | "Área do Triângulo" | "Regressão";

export type ModeMap = Record<
  Mode,
  { title: ModeTitle; component: JSX.Element; chart: JSX.Element }
>;


export interface FigureState {
  data: Data[];
  layout: Partial<Layout>;
  config?: Partial<Config>;
}

export type RegressionType = "linear" | "exponential" | "quadratic";