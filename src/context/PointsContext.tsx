"use client";

import { createContext, ReactNode, useState, useContext } from "react";
import { useModeContext } from "./ModeContext";
import type { Matrix, Vector } from "../types";
import { sumPoints } from "../utils/matrix";

interface PointsProviderProps {
  children: ReactNode;
}

interface TransformationUndoEntry {
  inverse: Matrix;
  anchor: Vector;
}

interface PointsContextType {
  points: Matrix;
  transformationUndoStack: TransformationUndoEntry[];
  addPoint: (newPoint: Vector, setErr: (param: string) => void) => void;
  removePoints: (pointIndices: number[]) => void;
  setPoints: (newPoints: Matrix) => void;
  setTransformationUndoStack: (callback: (prev: TransformationUndoEntry[]) => TransformationUndoEntry[]) => void;
}

const PointsContext = createContext<PointsContextType | null>(null);

const includesPoint = (currentPoints: Matrix, newPoint: Vector): boolean => {
  return currentPoints.some((p) => {
    return p[0] === newPoint[0] && p[1] === newPoint[1];
  });
};

const sortPointsByCentroidAngle = (newPoints: Matrix): Matrix => {
  const xCoord: number[] = newPoints.map((item) => item[0]);
  const yCoord: number[] = newPoints.map((item) => item[1]);

  const length = newPoints.length;

  const centerX = sumPoints(xCoord) / length;
  const centerY = sumPoints(yCoord) / length;

  const pointsWithAngle = newPoints.map((item) => {
    const deltaX: number = item[0] - centerX;
    const deltaY: number = item[1] - centerY;

    const angle = Math.atan2(deltaY, deltaX);

    return { point: item, angle };
  });

  const orderedByAngle = pointsWithAngle.sort((a, b) => a.angle - b.angle);

  return orderedByAngle.map((item) => item.point);
};

export function usePoints() {
  const context = useContext(PointsContext);

  if (!context) {
    throw new Error("ERROR IN CONTEXT");
  }

  return context;
}

export default function PointsProvider({ children }: PointsProviderProps) {
  const { mode } = useModeContext()

  const [points, setPoints] = useState<Matrix>([]);
  const [transformationUndoStack, setTransformationUndoStack] = useState<TransformationUndoEntry[]>([]);

  const addPoint = (newPoint: Vector, setErr: (param: string) => void) => {
    if (!includesPoint(points, newPoint)) {
      let newPoints: Matrix = [...points, newPoint];

      if (newPoints.length >= 3 && mode === "transformation") {
        newPoints = sortPointsByCentroidAngle(newPoints);
      }

      setPoints(newPoints);
    } else {
      setErr("Ponto já adicionado.");
    }
  };

  const removePoints = (pointsIndices: number[]) => {
    setPoints((prev: Matrix) =>
      prev.filter((_, index) => !pointsIndices.includes(index)),
    );
  };

  return (
    <PointsContext.Provider
      value={{
        points,
        transformationUndoStack,
        addPoint,
        removePoints,
        setPoints,
        setTransformationUndoStack,
      }}
    >
      {children}
    </PointsContext.Provider>
  );
}
