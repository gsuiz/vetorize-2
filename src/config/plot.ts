import type { Layout, Config, Data } from "plotly.js";
import type { Matrix } from "../types";

export function calculateDataConfig(points: Matrix):Data {
  return {
    x: points.map((item) => item[0]),
    y: points.map((item) => item[1]),
    type: "scatter",
    mode: "markers",
    marker: { color: "red", size: 12 },
    line: { width: 5 },
  };
}

export const BASE_LAYOUT: Partial<Layout> = {
  autosize: true,
  dragmode: "pan",
  paper_bgcolor: "transparent",
  plot_bgcolor: "transparent",

  xaxis: {
    gridcolor: "#222222",
    zerolinewidth:3,
    zerolinecolor: "#b2abab",
    tickfont: { color: "#a1a1aa" },
    tickformat: ".2~f",
    hoverformat: ".2~f",
  },
  yaxis: {
    gridcolor: "#222222",
    zerolinewidth:3,
    zerolinecolor: "#b2abab",
    tickfont: { color: "#a1a1aa" },
    tickformat: ".2~f",
    hoverformat: ".2~f",
    scaleanchor: "x",
    scaleratio: 1,
  },
  margin: { l: 50, r: 50, t: 60, b: 50 },
};

export const BASE_CONFIG: Partial<Config> = {
  responsive: true,
  displayModeBar: false,
  scrollZoom: true,
};
