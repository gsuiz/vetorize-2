"use client";

import { useState, useMemo } from "react";
import { usePoints } from "@/context/PointsContext";
import {
  calculateLinearRegression,
  calculateExpoRegression,
  calculateQuadraticRegression,
} from "@/utils/regression";
import type { RegressionType, RegressionCoefficients } from "@/types";

interface RegressionVariableLabels {
  dependent: string;
  independent: string;
}

export function useRegression() {
  const { points } = usePoints();

  const [variableLabels, setVariableLabels] =
    useState<RegressionVariableLabels>({
      dependent: "",
      independent: "",
    });

  const [chosenRegression, setChosenRegression] =
    useState<RegressionType>("linear");

  // derivado dos pontos: recalcula só quando points muda
  const regressionCoefficients: RegressionCoefficients | null  = useMemo(() => {
    switch (chosenRegression) {
      case "linear":
        return calculateLinearRegression(points);
      case "quadratic":
        return calculateQuadraticRegression(points);
      case "exponential":
        return calculateExpoRegression(points);
      default:
        return calculateLinearRegression(points);
    }
  }, [points, chosenRegression]);

  return {
    regressionCoefficients,
    chosenRegression,
    variableLabels,
    setVariableLabels,
    setChosenRegression,
  };
}
