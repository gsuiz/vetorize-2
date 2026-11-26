import { useMemo, useEffect } from "react";
import type { FigureState, Matrix, Vector } from "@/types";
import { usePoints } from "../../context/PointsContext";
import type { Annotation, Data } from "plotly.js";
import Plot from "@/components/Plot";
import {
  calculateAnchorPoint,
  getCoordinatesAndEndpoints,
  calculateTriangleArea,
} from "@/utils/matrix";
import { buildNonIntersectingTriangles } from "@/utils/triangles";

import { BASE_CONFIG, BASE_LAYOUT, calculateDataConfig } from "@/config/plot";

interface TrianglesChartProps {
  changeTrianglesTotalArea: (newArea: number) => void;
}

const TrianglesChart = ({ changeTrianglesTotalArea }: TrianglesChartProps) => {
  const { points } = usePoints();

  const { figure, totalArea } = useMemo(() => {
    const { maxX, minX, maxY, minY } = getCoordinatesAndEndpoints(points);

    const PADDING: number = 1.5;

    const trianglesPoints: Matrix[] = buildNonIntersectingTriangles(points);

    const annotations: Annotation[] = [];
    const traces: Data[] = [];
    let totalArea: number = 0;

    for (let i = 0; i < trianglesPoints.length; i++) {
      const triangle: Matrix = trianglesPoints[i];
      const triangleArea: number = calculateTriangleArea(triangle);
      const anchorPoint: Vector = calculateAnchorPoint(triangle);

      totalArea += triangleArea;

      const formattedArea = Number(triangleArea.toFixed(2));

      const triangleAnnotation: Annotation = {
        text: `<b>${formattedArea}</b>`,
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

      const closedTrianglePoints: Matrix = [
        triangle[0],
        triangle[1],
        triangle[2],
        triangle[0],
      ];

      const triangleTrace: Data = {
        ...calculateDataConfig(closedTrianglePoints),
        mode: "lines+markers",
        fill: "toself",
        name: `Triângulo ${i + 1}`,
        showlegend: false,
      };

      traces.push(triangleTrace);
    }

    const remainingCount = points.length % 3;

    if (remainingCount > 0) {
      const remainingPoints: Matrix = [];
      const startIndex = points.length - remainingCount;

      for (let i = startIndex; i < points.length; i++) {
        remainingPoints.push(points[i]);
      }

      const remainingTrace: Data = {
        ...calculateDataConfig(remainingPoints),
        mode: "markers",
        name: "Pontos pendentes",
        showlegend: false,
      };

      traces.push(remainingTrace);
    }

    if (traces.length === 0) {
      traces.push({
        ...calculateDataConfig([]),
        showlegend: false,
      });
    }

    const figure: FigureState = {
      data: traces,
      layout: {
        ...BASE_LAYOUT,
        showlegend: false,
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
