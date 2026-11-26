import { useMemo } from "react";
import type { FigureState } from "@/types";
import { usePoints } from "../../context/PointsContext";
import Plot from "@/components/Plot";
import { getCoordinatesAndEndpoints } from "@/utils/matrix";

import { BASE_CONFIG, BASE_LAYOUT, calculateDataConfig } from "@/config/plot";

const TransformationChart = () => {
  const { points } = usePoints();

  const figure: FigureState = useMemo(() => {
    const { xCoord, yCoord, maxX, minX, maxY, minY } =
      getCoordinatesAndEndpoints(points);

    const PADDING: number = 1.5;

    return {
      data: [
        {
          ...calculateDataConfig(points),
          fill: "toself",
          x: xCoord,
          y: yCoord,
        },
      ],
      layout: {
        ...BASE_LAYOUT,
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
  }, [points]);

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

export default TransformationChart;
