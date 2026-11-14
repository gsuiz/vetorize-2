import { usePoints } from "@/context/PointsContext";
import type { Transformation, Matrix, Vector } from "@/types";
import { calculateInverse, transformPointsAroundAnchor, calculateAnchorPoint } from "@/utils/matrix";

interface UndoItem {
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

  const { points, inversesStack, setPoints, setInversesStack } = usePoints();

  const applyTransformation = (transformation: Transformation) => {
    if (points.length === 0) {
      return;
    }

    const transformationMatrices: Matrix[] = [];
    let transMtx: Matrix;

    if (transformation.scale) {
      const { sx, sy } = transformation.scale;

      transMtx = [
        [sx, 0],
        [0, sy],
      ];

      transformationMatrices.push(transMtx);
    }

    if (transformation.rotation) {
      const rad = transformation.rotation * (Math.PI / 180);

      transMtx = [
        [Math.cos(rad), Math.sin(rad)],
        [-Math.sin(rad), Math.cos(rad)],
      ];

      transformationMatrices.push(transMtx);
    }

    if (transformation.reflection) {
      let transMtx: Matrix;

      switch (transformation.reflection) {
        case "x":
          transMtx = REFLECTION_MATRIX_X;
          break;
        case "y":
          transMtx = REFLECTION_MATRIX_Y;
          break;
        default:
          transMtx = REFLECTION_MATRIX_ORIGIN;
      }

      transformationMatrices.push(transMtx);
    }

    const effectiveAnchor: Vector =
      transformation.anchor ?? calculateAnchorPoint(points);

    setInversesStack((prev) => [
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
    const { inverse: lastInverseMatrix, anchor }: UndoItem =
      inversesStack.at(-1)!;

    const newPoints = transformPointsAroundAnchor(
      points,
      lastInverseMatrix,
      anchor,
    );

    setInversesStack((prev) => prev.slice(0, -1));
    setPoints(newPoints);
  };

  return { applyTransformation, undoTransformation }
}
