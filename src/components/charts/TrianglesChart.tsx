import { useMemo, useEffect } from "react";
import type { FigureState, Matrix, Vector } from "@/types";
import { usePoints } from "../../context/PointsContext";
import type { Annotation } from "plotly.js";
import Plot from "@/components/Plot";
import {
  calculateAnchorPoint,
  generateNullArray,
  getCoordinatesAndEndpoints,
  calculateTriangleArea,
} from "@/utils/matrix";

import { BASE_CONFIG, BASE_LAYOUT, calculateDataConfig } from "@/config/plot";

interface TrianglesChartProps {
  changeTrianglesTotalArea: (newArea: number) => void;
}

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

const TrianglesChart = ({ changeTrianglesTotalArea }: TrianglesChartProps) => {
  const { points } = usePoints();

  const { figure, totalArea } = useMemo(() => {
    const { xCoord, yCoord, maxX, minX, maxY, minY } =
      getCoordinatesAndEndpoints(points);

    const PADDING: number = 1.5;

    const [xCoordWithSeparation, yCoordWithSeparation] = addNullsInPoints(
      xCoord,
      yCoord,
    );

    const xCoordSegmentsTriangles =
      getTrianglesInSeparations(xCoordWithSeparation);
    const yCoordSegmentsTriangles =
      getTrianglesInSeparations(yCoordWithSeparation);

    const trianglesPoints: Matrix[] = xCoordSegmentsTriangles.map(
      (segPoints: number[], segIndex) =>
        segPoints.map((point: number, pointIndex) => [
          point,
          yCoordSegmentsTriangles[segIndex][pointIndex],
        ]),
    );

    const annotations: Annotation[] = [];
    let totalArea: number = 0;

    trianglesPoints.forEach((triangle: Matrix) => {
      const triangleArea: number = calculateTriangleArea(triangle);
      const anchorPoint: Vector = calculateAnchorPoint(triangle);

      totalArea += triangleArea;

      const triangleAnnotation: Annotation = {
        text: `<b>${triangleArea}</b>`,
        font: {
          family: "JetBrains Mono",
          color: "#ffffff",
          size: 16,
        },
        showarrow: false,
        xref: "x",
        yref: "y",
        x: anchorPoint[0],
        y: anchorPoint[1],
      };

      annotations.push(triangleAnnotation);
    });

    const figure: FigureState = {
      data: [
        {
          ...calculateDataConfig(points),
          fill: "toself",
          x: xCoordWithSeparation,
          y: yCoordWithSeparation,
        },
      ],
      layout: {
        ...BASE_LAYOUT,
        annotations,
        xaxis: {
          ...BASE_LAYOUT.xaxis,
          range: points.length
            ? [minX - PADDING, maxX + PADDING]
            : [-PADDING, PADDING],
        },
        yaxis: {
          ...BASE_LAYOUT.yaxis,
          range: points.length
            ? [minY - PADDING, maxY + PADDING]
            : [-PADDING, PADDING],
        },
      },
      config: BASE_CONFIG,
    };

    return { figure, totalArea };
  }, [points]);

  useEffect(() => {
    changeTrianglesTotalArea(totalArea);
  }, [totalArea, changeTrianglesTotalArea]);

  return (
    <Plot
      data={figure.data}
      layout={figure.layout}
      config={figure.config}
      useResizeHandler={true}
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default TrianglesChart;
