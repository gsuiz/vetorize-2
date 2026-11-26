import { Matrix, Vector } from "../types";
import { isMatrix } from "./validators";

export const multiplyMatrices = (
  leftMatrix: number[][],
  rightMatrix: number[][],
): number[][] => {
  const rowCount = leftMatrix.length;
  const sharedDimension = leftMatrix[0].length;
  const columnCount = rightMatrix[0].length;

  const result: number[][] = Array(rowCount)
    .fill(0)
    .map(() => Array(columnCount).fill(0));

  for (let i = 0; i < rowCount; i++) {
    for (let j = 0; j < columnCount; j++) {
      for (let k = 0; k < sharedDimension; k++) {
        result[i][j] += leftMatrix[i][k] * rightMatrix[k][j];
      }
    }
  }

  return result;
};

/**
 * @param currentPoints
 * @param transformationMatrices
 * @param anchorPoint
 *
 */

export const transformPointsAroundAnchor = (
  currentPoints: Matrix,
  transformationMatrices: Matrix | Matrix[],
  anchorPoint: Vector,
): Matrix => {
  let newPoints = currentPoints.map(([x, y]) => [
    x - anchorPoint[0],
    y - anchorPoint[1],
  ]) as Matrix;

  if (isMatrix(transformationMatrices)) {
    newPoints = multiplyMatrices(newPoints, transformationMatrices) as Matrix;
  } else {
    transformationMatrices.forEach((matrix) => {
      newPoints = multiplyMatrices(newPoints, matrix) as Matrix;
    });
  }

  newPoints = newPoints.map(([x, y]) => [
    x + anchorPoint[0],
    y + anchorPoint[1],
  ]);

  return newPoints;
};

export const addMatrices = (
  leftMatrix: number[][],
  rightMatrix: number[][],
): number[][] => {
  return leftMatrix.map((row, rowIndex) =>
    row.map((value, columnIndex) => value + rightMatrix[rowIndex][columnIndex]),
  );
};

export const multiplyMatrixByScalar = (
  matrix: number[][],
  scalar: number,
): number[][] => {
  return matrix.map((row) => row.map((value) => value * scalar));
};

/**
 * @param matrix
 *
 */
export const calculateInverse = (matrix: Matrix): Matrix => {
  const lines: number = matrix.length;
  const columns: number = matrix[0].length;

  // const identity: number[][] = [...Array(lines)].map((_, lineIndex) =>
  //   [...Array(columns)].map((_, columnIndex) =>
  //     lineIndex === columnIndex ? 1 : 0,
  //   ),
  // );

  const adjugateMatrix: Matrix = matrix.map((row) => [...row]);

  const firstDiagonalValue: number = adjugateMatrix[0][0];
  adjugateMatrix[0][0] = adjugateMatrix[lines - 1][columns - 1];
  adjugateMatrix[columns - 1][lines - 1] = firstDiagonalValue;

  adjugateMatrix[0][columns - 1] *= -1;
  adjugateMatrix[lines - 1][0] *= -1;

  const determinant: number =
    adjugateMatrix[0][0] * adjugateMatrix[lines - 1][columns - 1] -
    adjugateMatrix[0][columns - 1] * adjugateMatrix[lines - 1][0];

  const inverseMatrix = adjugateMatrix.map((row: [number, number]) =>
    row.map((value: number) => value / determinant),
  );

  return inverseMatrix as Matrix;
};

/**
 *
 * @param param
 *
 */

export const sumPoints = (param: number[]) => {
  return param.reduce((acc, item) => (acc += item), 0);
};

/**
 *
 * @param currentPoints
 *
 */

export const calculateAnchorPoint = (currentPoints: Matrix): Vector => {
  const xCoord: number[] = currentPoints.map((item) => item[0]);
  const yCoord: number[] = currentPoints.map((item) => item[1]);

  const xCenter = sumPoints(xCoord) / xCoord.length;
  const yCenter = sumPoints(yCoord) / yCoord.length;

  return [xCenter, yCenter];
};

/**
 *
 * @param m
 *
 */

export const transpose = (m: number[][]): number[][] => {
  return m[0].map((_, columnIndex) => m.map((row) => row[columnIndex]));
};

/**
 *
 * @param length
 *
 */

export const generateNullArray = (length: number): (number | null)[] =>
  [...Array(length)].map(() => null);

/**
 *
 * @param points
 *
 */

export const getCoordinatesAndEndpoints = (points: Matrix) => {
  const xCoord: number[] = points.map((point) => point[0]);
  const yCoord: number[] = points.map((point) => point[1]);

  const maxX: number = Math.max(...xCoord);
  const minX: number = Math.min(...xCoord);
  const maxY: number = Math.max(...yCoord);
  const minY: number = Math.min(...yCoord);

  return { xCoord, yCoord, maxX, maxY, minX, minY };
};

/**
 *
 * @param param
 *
 */

export const flatten2DMatrix = (param: number[][]): number[] => {
  return param.reduce((acc, item) => [...acc, ...item], []);
};

export const calculateDeterminant3x3 = (matrix: number[][]) => {
  if (matrix.length !== 3 || matrix.some((row) => row.length !== 3)) {
    throw new Error("A matriz não possui o formato 3x3.");
  }

  const expandedMatrix: number[][] = matrix.map((row) => [
    ...row,
    row[0],
    row[1],
  ]);

  let principalSum: number = 0;
  let secondarySum: number = 0;

  for (let i = 0; i <= 2; i++) {
    let mainMultiplication: number = 1;
    let secondatyMultiplication: number = 1;

    for (let j = 0; j <= 2; j++) {
      mainMultiplication *= expandedMatrix[j][j + i];
      secondatyMultiplication *= expandedMatrix[j][i + 2 - j];
    }

    principalSum += mainMultiplication;
    secondarySum += secondatyMultiplication;
  }

  return principalSum - secondarySum;
};

export const calculateTriangleArea = (trianglePoints: Matrix): number => {
  const triangleMatrix = trianglePoints.map((point: Vector) => [...point, 1]);

  const determinant: number = calculateDeterminant3x3(triangleMatrix);

  return Math.abs(determinant) / 2;
};
