import { useState, useEffect } from "react";
import type { FigureState, Matrix, Vector } from "@/types";
import { usePoints } from "../../context/PointsContext";
import type { FigureCallback } from "react-plotly.js";
import type { Annotation } from "plotly.js";
import Plot from "@/components/Plot";
import {
  calculateAnchorPoint,
  generateNullArray,
  getCoordinatesAndEndpoints,
  calculateTriangleArea
} from "@/utils/matrix";

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

  function getTrianglesInSeparations(
    pointsWithSep: (number | null)[],
  ): number[][] {
    let baseIndex: number = 0;

    const trianglesCoordSegments = pointsWithSep.reduce(
      (acc: number[][], item: number | null, index: number) => {
        if (item === null) {
          acc.push(pointsWithSep.slice(baseIndex, index) as number[]);
          baseIndex = index + 1;
        }

        return acc;
      },
      [],
    );

    return trianglesCoordSegments;
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

    // divide os pontos pelos nulls

    const xCoordSegmentsTriangles =
      getTrianglesInSeparations(xCoordWithSeparation);
    const yCoordSegmentsTriangles =
      getTrianglesInSeparations(yCoordWithSeparation);

    // talvez seja melhor iterar nos 3 pontos acima.

    const trianglesPoints: Matrix[] = xCoordSegmentsTriangles.map( // [ [ [ 3, 7 ], [ 1, 4 ], [ 0, 6 ] ], [ [ 6, 0 ], [ 8, 1 ], [ 10, 5 ] ] ]
      (segPoints: number[], segIndex) =>
        segPoints.map((point: number, pointIndex) => [
          point,
          yCoordSegmentsTriangles[segIndex][pointIndex],
        ]),
    );

    const annotations: Annotation[] = [];
  
    let totalArea: number = 0

    trianglesPoints.forEach((triangle:Matrix) => {   
      const triangleArea: number = calculateTriangleArea(triangle)
      const anchorPoint: Vector = calculateAnchorPoint(triangle)

      totalArea+= triangleArea

      const triangleAnnotation: Annotation = {
        text: `<b>${triangleArea}</b>`,
        font: {
          family: "JetBrains Mono",
          color:"#ffffff",
          size:16,
        },
        showarrow:false,
        xref: "x",
        yref: "y",
        x: anchorPoint[0],
        y: anchorPoint[1]
      }

      annotations.push(triangleAnnotation)
    })

    console.log(totalArea)

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
          annotations: annotations,
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
