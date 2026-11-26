"use client";

import { useMemo } from "react";
import type { Data, Layout } from "plotly.js";
import { usePoints } from "@/context/PointsContext";
import { useRegressionContext } from "@/context/RegressionContext";
import { BASE_LAYOUT, BASE_CONFIG, calculateDataConfig } from "@/config/plot";
import Plot from "@/components/Plot";
import { getCoordinatesAndEndpoints } from "@/utils/matrix";
import { calculateRegressionImage } from "@/utils/regression";
import { isValidRegressionCoefficients } from "@/utils/validators";

export default function RegressionChart() {
  const { points } = usePoints();
  const {
    regressionCoefficients,
    variableLabels,
    chosenRegression,
    estimationPoint,
  } = useRegressionContext();

  const data: Data[] = useMemo(() => {
    const traces: Data[] = [calculateDataConfig(points)];

    if (
      isValidRegressionCoefficients(regressionCoefficients) &&
      points.length >= 2
    ) {
      const { minX, maxX } = getCoordinatesAndEndpoints(points);
      const PADDING = 10;

      let startX = minX - PADDING;
      let endX = maxX + PADDING;

      if (estimationPoint !== null) {
        if (estimationPoint < minX) {
          startX = estimationPoint - PADDING;
        }
        if (estimationPoint > maxX) {
          endX = estimationPoint + PADDING;
        }
      }

      const STEP = 0.06;
      const lineX: number[] = [];
      const lineY: number[] = [];

      for (let currentX = startX; currentX <= endX; currentX += STEP) {
        lineX.push(currentX);
        lineY.push(
          calculateRegressionImage(
            chosenRegression,
            regressionCoefficients,
            currentX,
          ),
        );
      }

      traces.push({
        x: lineX,
        y: lineY,
        type: "scatter",
        mode: "lines",
        name: "Regressão",
        line: { color: "#3b82f6", width: 3 },
      });

      if (estimationPoint !== null) {
        const estimationResult = calculateRegressionImage(
          chosenRegression,
          regressionCoefficients,
          estimationPoint,
        );

        traces.push({
          x: [0, estimationPoint, estimationPoint],
          y: [estimationResult, estimationResult, 0],
          type: "scatter",
          mode: "markers+lines",
          name: "Estimativa",
          marker: {
            color: "#ffa600",
            size: [0, 13, 0],
          },
          line: {
            dash: "dash",
            color: "#f8f017",
            width: 1,
          },
        });
      }
    }

    return traces;
  }, [points, regressionCoefficients, chosenRegression, estimationPoint]);

  const layout: Partial<Layout> = useMemo(() => {
    if (points.length === 0) {
      return {
        ...BASE_LAYOUT,
        showlegend: false,
        xaxis: {
          ...BASE_LAYOUT.xaxis,
          title: { text: variableLabels.independent || "x" },
          range: [-5, 5],
        },
        yaxis: {
          ...BASE_LAYOUT.yaxis,
          title: { text: variableLabels.dependent || "y" },
          range: [-5, 5],
        },
      };
    }

    const { maxX, minX, maxY, minY } = getCoordinatesAndEndpoints(points);

    let viewMinX = minX;
    let viewMaxX = maxX;
    let viewMinY = minY;
    let viewMaxY = maxY;

    if (
      estimationPoint !== null &&
      isValidRegressionCoefficients(regressionCoefficients)
    ) {
      const estimationResult = calculateRegressionImage(
        chosenRegression,
        regressionCoefficients,
        estimationPoint,
      );

      if (estimationPoint < viewMinX) viewMinX = estimationPoint;
      if (estimationPoint > viewMaxX) viewMaxX = estimationPoint;
      if (estimationResult < viewMinY) viewMinY = estimationResult;
      if (estimationResult > viewMaxY) viewMaxY = estimationResult;
    }

    const PADDING = 1.5;

    return {
      ...BASE_LAYOUT,
      showlegend: false,
      xaxis: {
        ...BASE_LAYOUT.xaxis,
        title: { text: variableLabels.independent || "x" },
        range: [viewMinX - PADDING, viewMaxX + PADDING],
      },
      yaxis: {
        ...BASE_LAYOUT.yaxis,
        title: { text: variableLabels.dependent || "y" },
        range: [viewMinY - PADDING, viewMaxY + PADDING],
      },
    };
  }, [
    points,
    variableLabels,
    estimationPoint,
    regressionCoefficients,
    chosenRegression,
  ]);

  return (
    <div className="flex flex-col items-start gap-3 h-full">
      <div className="flex items-center gap-6 text-sm font-medium text-white">
        <span className="flex items-center gap-2 font-jetbrains">
          <span className="w-3 h-3 rounded-full bg-red-500 border border-white/30" />
          Pontos de Ajuste
        </span>
        {estimationPoint !== null &&
          isValidRegressionCoefficients(regressionCoefficients) && (
            <span className="flex items-center gap-2 font-jetbrains">
              <span className="w-3 h-3 rounded-full bg-yellow-400 border border-white/30" />
              Estimativa
            </span>
          )}
      </div>
      <Plot
        data={data}
        layout={layout}
        config={BASE_CONFIG}
        useResizeHandler={true}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
}
