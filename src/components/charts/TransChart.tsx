import { useState, useEffect } from "react";
import type { Data, Layout, Config } from "plotly.js";
import { usePoints } from "../../context/PointsContext";
import { FigureCallback } from "react-plotly.js";
import Plot from "@/components/Plot"

import {
  BASE_CONFIG,
  BASE_LAYOUT,
  calculateDataConfig,
} from "@/config/plot";

interface FigureState {
  data: Data[];
  layout: Partial<Layout>;
  config?: Partial<Config>;
}

const TransChart = () => {
  const { points } = usePoints();

  const [figure, setFigure] = useState<FigureState>({
    data: [{...calculateDataConfig(points), fill:"toself"}],
    layout: BASE_LAYOUT,
    config: BASE_CONFIG,
  });

  const updateFigure = (figure: FigureState) => {
    setFigure((prev) => ({
      ...prev,
      ...figure,
    }));
  };

  useEffect(() => {
    const xCoord: number[] = points.map((point) => point[0]);
    const yCoord: number[] = points.map((point) => point[1]);

    const maxX: number = Math.max(...xCoord);
    const minX: number = Math.min(...xCoord);
    const maxY: number = Math.max(...yCoord);
    const minY: number = Math.min(...yCoord);

    const PADDING: number = 1.5;

    setFigure((prev: FigureState) => ({
      ...prev,
      data: [
        {
          ...prev.data[0],
          x: xCoord,
          y: yCoord,
        },
      ],
      layout: {
        ...prev.layout,
        xaxis: {
          range: [minX - PADDING, maxX + PADDING],
          ...prev.layout.xaxis,
        },
        yaxis: {
          range: [minY - PADDING, maxY + PADDING],
          ...prev.layout.yaxis,
        },
      },
    }));
  }, [points]);

  return (
    <Plot
      data={figure.data}
      layout={figure.layout}
      config={figure.config}
      onInitialized={updateFigure as FigureCallback}
      onUpdate={updateFigure as FigureCallback}
      useResizeHandler={true}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default TransChart;