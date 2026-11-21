"use client";
import { createContext, ReactNode, useContext, useState, useMemo } from "react";
import { usePoints } from "@/context/PointsContext";
import {
  calculateLinearRegression,
  calculateExpoRegression,
  calculateQuadraticRegression,
} from "@/utils/regression";
import type { RegressionType, RegressionCoefficients } from "@/types";

interface RegressionProviderType {
  children: ReactNode;
}

interface RegressionVariableLabels {
  dependent: string;
  independent: string;
}

interface RegressionContextType {
  regressionCoefficients: RegressionCoefficients | null;
  chosenRegression: RegressionType;
  variableLabels: RegressionVariableLabels;
  setVariableLabels: (param:RegressionVariableLabels) => void;
  setChosenRegression: (param: RegressionType) => void;
}

const RegressionContext = createContext<RegressionContextType | null>(null);

export default function RegressionProvider({
  children,
}: RegressionProviderType) {
  const { points } = usePoints();

  const [variableLabels, setVariableLabels] =
    useState<RegressionVariableLabels>({
      dependent: "",
      independent: "",
    });

  const [chosenRegression, setChosenRegression] =
    useState<RegressionType>("linear");

  const regressionCoefficients: RegressionCoefficients | null = useMemo(() => {
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

  return (
    <RegressionContext.Provider
      value={{
        regressionCoefficients,
        chosenRegression,
        variableLabels,
        setVariableLabels,
        setChosenRegression,
      }}
    >
      {children}
    </RegressionContext.Provider>
  );
}

export function useRegressionContext(){
    const context = useContext(RegressionContext)

    if(!context){
        throw new Error("ERROR IN CONTEXT")
    }

    return context
}