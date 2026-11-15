import { useState, useEffect } from "react";
import type { FigureState } from "@/types";
import { usePoints } from "../../context/PointsContext";
import { FigureCallback } from "react-plotly.js";
import Plot from "@/components/Plot";
import { generateNullArray, getCoordinatesAndEndpoints } from "@/utils/matrix";

import { BASE_CONFIG, BASE_LAYOUT, calculateDataConfig } from "@/config/plot";

const TrianglesChart = () => {
  const { points } = usePoints();

  const [figure, setFigure] = useState<FigureState>({
    data: [{ ...calculateDataConfig(points), fill: "toself" }],
    layout: BASE_LAYOUT,
    config: BASE_CONFIG,
  });

  const updateFigure = (figure: FigureState) => {
    setFigure((prev) => ({
      ...prev,
      ...figure,
    }));
  };

  function addNullsInPoints(xCoord: number[], yCoord: number[]) {
    const arrLength: number = xCoord.length;

    const nNULLs: number = Math.floor(arrLength / 3);

    let nullsAdded: number = 0;

    const newXCoord: (number | null)[] = generateNullArray(nNULLs + arrLength);
    const newYCoord: (number | null)[] = generateNullArray(nNULLs + arrLength);

    xCoord.forEach((_, index) => {
      if (index > 0 && index % 3 === 0) nullsAdded++;

      newXCoord[index + nullsAdded] = xCoord[index];
      newYCoord[index + nullsAdded] = yCoord[index];
    });

    return [newXCoord, newYCoord];
  }

  useEffect(() => {
    // verificação se foi adicionado 3 pontos.

    const { xCoord, yCoord, maxX, minX, maxY, minY } =
      getCoordinatesAndEndpoints(points);

    const PADDING: number = 1.5;

    const [xCoordWithSeparation, yCoordWithSeparation] = addNullsInPoints(
      xCoord,
      yCoord,
    );

    setFigure((prev: FigureState) => {
      return {
        ...prev,
        data: [
          {
            ...prev.data[0],
            x: xCoordWithSeparation,
            y: yCoordWithSeparation,
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
      };
    });
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

export default TrianglesChart;
