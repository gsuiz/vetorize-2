"use client";

import { createContext, ReactNode, useState, useContext, useEffect } from "react";
import { useModeContext } from "./ModeContext";
import type { Matrix, Mode, Vector } from "../types";
import { isMatrix } from "@/utils/validators";
import { sortPointsByCentroidAngle } from "@/utils/triangles";

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

const getStoredPoints = (): Matrix => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedPoints = localStorage.getItem("points");

    if(!storedPoints){
      return []
    }

    const matrixStoredPoints:number[][] = JSON.parse(storedPoints) 
    
    return isMatrix(matrixStoredPoints) ? matrixStoredPoints : []
  } catch(err) {
    throw new Error(`Error during retrieval of stored points: ${err}`)
  }
}

const includesPoint = (
  currentPoints: Matrix,
  newPoint: Vector,
  mode: Mode,
): boolean => {
  let startIndex = 0;

  if (mode === "triangles") {
    const pointsInCurrentTriangle = currentPoints.length % 3;
    startIndex = currentPoints.length - pointsInCurrentTriangle;
  }

  for (let i = startIndex; i < currentPoints.length; i++) {
    if (
      currentPoints[i][0] === newPoint[0] &&
      currentPoints[i][1] === newPoint[1]
    ) {
      return true;
    }
  }

  return false;
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

  const savedPoints = getStoredPoints()

  const [points, setPoints] = useState<Matrix>(savedPoints);
  const [transformationUndoStack, setTransformationUndoStack] = useState<TransformationUndoEntry[]>([]);

  useEffect(() => {
    localStorage.setItem("points", JSON.stringify(points))
  }, [points])

  const addPoint = (newPoint: Vector, setErr: (param: string) => void) => {
    if (!includesPoint(points, newPoint, mode)) {
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
