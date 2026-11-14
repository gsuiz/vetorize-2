"use client";

import { useState, useMemo } from "react";
import { usePoints } from "@/context/PointsContext";
import { calculateLinearRegression } from "@/utils/regression";

interface RegressionVariableLabels {
  dependent: string;
  independent: string;
}

export function useRegression() {
  const { points } = usePoints();

  const [variableLabels, setVariableLabels] = useState<RegressionVariableLabels>({
    dependent: "",
    independent: "",
  });

  // derivado dos pontos: recalcula só quando points muda
  const regressionCoefficients = useMemo(() => calculateLinearRegression(points), [points]);

  return { regressionCoefficients, variableLabels, setVariableLabels }
}