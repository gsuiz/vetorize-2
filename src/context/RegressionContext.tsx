"use client";
import {
  createContext,
  ReactNode,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import { usePoints } from "@/context/PointsContext";
import {
  calculateLinearRegression,
  calculateExpoRegression,
  calculateQuadraticRegression,
} from "@/utils/regression";
import { isRegressionType } from "@/utils/validators";
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
  estimationPoint: number | null;
  setEstimationPoint: (point: number | null) => void;
  setVariableLabels: (variableLabels: RegressionVariableLabels) => void;
  setChosenRegression: (type: RegressionType) => void;
}

const RegressionContext = createContext<RegressionContextType | null>(null);

const getStoredRegressionType = (): RegressionType => {
  try {
    const storedRegressionType = localStorage.getItem("regressionType");

    return isRegressionType(storedRegressionType)
      ? storedRegressionType
      : "linear";
  } catch (err) {
    throw `Error during retrieval of the stored regression type: ${err}`;
  }
};

export default function RegressionProvider({
  children,
}: RegressionProviderType) {
  const { points } = usePoints();

  const [estimationPoint, setEstimationPoint] = useState<number | null>(null);

  const [variableLabels, setVariableLabels] =
    useState<RegressionVariableLabels>({
      dependent: "",
      independent: "",
    });

  const savedRegressionType = getStoredRegressionType();

  const [chosenRegression, setChosenRegression] =
    useState<RegressionType>(savedRegressionType);

  useEffect(() => {
    localStorage.setItem("regressionType", chosenRegression);
  }, [chosenRegression]);

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
        estimationPoint,
        setEstimationPoint,
        setVariableLabels,
        setChosenRegression,
      }}
    >
      {children}
    </RegressionContext.Provider>
  );
}

export function useRegressionContext() {
  const context = useContext(RegressionContext);

  if (!context) {
    throw new Error("ERROR IN CONTEXT");
  }

  return context;
}
