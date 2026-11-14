import { usePoints } from "@/context/PointsContext";
import type { Transformation, Matrix, Vector } from "@/types";
import { calculateInverse, transformPointsAroundAnchor, calculateAnchorPoint } from "@/utils/matrix";

interface TransformationUndoEntry {
  inverse: Matrix;
  anchor: Vector;
}

export default function useTransformation() {
  const REFLECTION_MATRIX_X: Matrix = [
    [1, 0],
    [0,-1],
  ];
  const REFLECTION_MATRIX_Y: Matrix = [
    [-1,0],
    [0, 1],
  ];
  const REFLECTION_MATRIX_ORIGIN: Matrix = [
    [-1, 0],
    [0, -1],
  ];

  const { points, transformationUndoStack, setPoints, setTransformationUndoStack } = usePoints();

  const applyTransformation = (transformation: Transformation) => {
    if (points.length === 0) {
      return;
    }

    const transformationMatrices: Matrix[] = [];
    let transformationMatrix: Matrix;

    if (transformation.scale) {
      const { sx, sy } = transformation.scale;

      transformationMatrix = [
        [sx, 0],
        [0, sy],
      ];

      transformationMatrices.push(transformationMatrix);
    }

    if (transformation.rotation) {
      const rotationRadians = transformation.rotation * (Math.PI / 180);

      transformationMatrix = [
        [Math.cos(rotationRadians), Math.sin(rotationRadians)],
        [-Math.sin(rotationRadians), Math.cos(rotationRadians)],
      ];

      transformationMatrices.push(transformationMatrix);
    }

    if (transformation.reflection) {
      let reflectionMatrix: Matrix;

      switch (transformation.reflection) {
        case "x":
          reflectionMatrix = REFLECTION_MATRIX_X;
          break;
        case "y":
          reflectionMatrix = REFLECTION_MATRIX_Y;
          break;
        default:
          reflectionMatrix = REFLECTION_MATRIX_ORIGIN;
      }

      transformationMatrices.push(reflectionMatrix);
    }

    const effectiveAnchor: Vector =
      transformation.anchor ?? calculateAnchorPoint(points);

    setTransformationUndoStack((prev) => [
      ...prev,
      ...transformationMatrices.map((matrix) => ({
        inverse: calculateInverse(matrix),
        anchor: effectiveAnchor,
      })),
    ]);

    const newPoints = transformPointsAroundAnchor(
      points,
      transformationMatrices,
      effectiveAnchor,
    );

    setPoints(newPoints);
  };

  const undoTransformation = () => {
    const { inverse: lastInverseMatrix, anchor }: TransformationUndoEntry =
      transformationUndoStack.at(-1)!;

    const newPoints = transformPointsAroundAnchor(
      points,
      lastInverseMatrix,
      anchor,
    );

    setTransformationUndoStack((prev) => prev.slice(0, -1));
    setPoints(newPoints);
  };

  return { applyTransformation, undoTransformation }
}
