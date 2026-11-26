import type { Matrix, Vector } from "@/types";
import {
  calculateAnchorPoint,
  calculateDeterminant3x3,
  calculateTriangleArea,
} from "./matrix";

export const arePointsEqual = (pointA: Vector, pointB: Vector): boolean => {
  return pointA[0] === pointB[0] && pointA[1] === pointB[1];
};

export const removeDuplicatePoints = (points: Matrix): Matrix => {
  const uniquePoints: Matrix = [];

  for (let i = 0; i < points.length; i++) {
    let alreadyExists = false;

    for (let j = 0; j < uniquePoints.length; j++) {
      if (arePointsEqual(points[i], uniquePoints[j])) {
        alreadyExists = true;
        break;
      }
    }

    if (!alreadyExists) {
      uniquePoints.push(points[i]);
    }
  }

  return uniquePoints;
};

export const sortPointsByCentroidAngle = (points: Matrix): Matrix => {
  const length = points.length;
  if (length === 0) {
    return [];
  }

  const center = calculateAnchorPoint(points);
  const centerX = center[0];
  const centerY = center[1];

  const orderedPoints: Matrix = [];
  for (let i = 0; i < length; i++) {
    orderedPoints.push(points[i]);
  }

  for (let i = 0; i < length - 1; i++) {
    for (let j = 0; j < length - 1 - i; j++) {
      const pointA = orderedPoints[j];
      const pointB = orderedPoints[j + 1];

      const angleA = Math.atan2(pointA[1] - centerY, pointA[0] - centerX);
      const angleB = Math.atan2(pointB[1] - centerY, pointB[0] - centerX);

      let shouldSwap = false;

      if (Math.abs(angleA - angleB) < 0.000001) {
        const distanceA =
          (pointA[0] - centerX) * (pointA[0] - centerX) +
          (pointA[1] - centerY) * (pointA[1] - centerY);
        const distanceB =
          (pointB[0] - centerX) * (pointB[0] - centerX) +
          (pointB[1] - centerY) * (pointB[1] - centerY);
        shouldSwap = distanceA > distanceB;
      } else {
        shouldSwap = angleA > angleB;
      }

      if (shouldSwap) {
        orderedPoints[j] = pointB;
        orderedPoints[j + 1] = pointA;
      }
    }
  }

  return orderedPoints;
};

// O sinal do determinante 3x3 indica a orientação dos 3 pontos no plano:
// > 0: sentido anti-horário
// < 0: sentido horário
// = 0: pontos colineares
export const calculateTriangleDeterminant = (
  pointA: Vector,
  pointB: Vector,
  pointC: Vector,
): number => {
  const matrix = [
    [pointA[0], pointA[1], 1],
    [pointB[0], pointB[1], 1],
    [pointC[0], pointC[1], 1],
  ];

  return calculateDeterminant3x3(matrix);
};

export const isPointStrictlyOnSegment = (
  point: Vector,
  segmentStart: Vector,
  segmentEnd: Vector,
): boolean => {
  if (
    arePointsEqual(point, segmentStart) ||
    arePointsEqual(point, segmentEnd)
  ) {
    return false;
  }

  const determinant = calculateTriangleDeterminant(
    segmentStart,
    segmentEnd,
    point,
  );

  if (Math.abs(determinant) > 0.000001) {
    return false;
  }

  const minX = Math.min(segmentStart[0], segmentEnd[0]);
  const maxX = Math.max(segmentStart[0], segmentEnd[0]);
  const minY = Math.min(segmentStart[1], segmentEnd[1]);
  const maxY = Math.max(segmentStart[1], segmentEnd[1]);

  return (
    point[0] >= minX &&
    point[0] <= maxX &&
    point[1] >= minY &&
    point[1] <= maxY
  );
};

export const doSegmentsIntersect = (
  startA: Vector,
  endA: Vector,
  startB: Vector,
  endB: Vector,
): boolean => {
  const sharesFirstEndpoint =
    arePointsEqual(startA, startB) || arePointsEqual(startA, endB);
  const sharesSecondEndpoint =
    arePointsEqual(endA, startB) || arePointsEqual(endA, endB);

  // Se os dois segmentos são a mesma aresta compartilhada, não há cruzamento
  if (sharesFirstEndpoint && sharesSecondEndpoint) {
    return false;
  }

  // Se o vértice de um triângulo cai no meio da aresta do outro
  if (
    isPointStrictlyOnSegment(startA, startB, endB) ||
    isPointStrictlyOnSegment(endA, startB, endB) ||
    isPointStrictlyOnSegment(startB, startA, endA) ||
    isPointStrictlyOnSegment(endB, startA, endA)
  ) {
    return true;
  }

  // Se compartilham apenas 1 vértice em comum, apenas se tocam na ponta
  if (sharesFirstEndpoint || sharesSecondEndpoint) {
    return false;
  }

  const det1 = calculateTriangleDeterminant(startA, endA, startB);
  const det2 = calculateTriangleDeterminant(startA, endA, endB);
  const det3 = calculateTriangleDeterminant(startB, endB, startA);
  const det4 = calculateTriangleDeterminant(startB, endB, endA);

  if (det1 * det2 < 0 && det3 * det4 < 0) {
    return true;
  }

  return false;
};

export const isPointStrictlyInsideTriangle = (
  point: Vector,
  triangle: Matrix,
): boolean => {
  for (let i = 0; i < 3; i++) {
    if (arePointsEqual(point, triangle[i])) {
      return false;
    }
  }

  const totalArea = calculateTriangleArea(triangle);
  if (totalArea === 0) {
    return false;
  }

  const area1 = calculateTriangleArea([point, triangle[0], triangle[1]]);
  const area2 = calculateTriangleArea([point, triangle[1], triangle[2]]);
  const area3 = calculateTriangleArea([point, triangle[2], triangle[0]]);

  if (area1 === 0 || area2 === 0 || area3 === 0) {
    return false;
  }

  const sumOfSubAreas = area1 + area2 + area3;

  return Math.abs(totalArea - sumOfSubAreas) < 0.000001;
};

export const doTrianglesIntersect = (
  triangleA: Matrix,
  triangleB: Matrix,
): boolean => {
  // 1. Verifica se alguma aresta do triângulo A cruza alguma aresta do triângulo B
  for (let i = 0; i < 3; i++) {
    const startA = triangleA[i];
    const endA = triangleA[(i + 1) % 3];

    for (let j = 0; j < 3; j++) {
      const startB = triangleB[j];
      const endB = triangleB[(j + 1) % 3];

      if (doSegmentsIntersect(startA, endA, startB, endB)) {
        return true;
      }
    }
  }

  // 2. Verifica se algum vértice de um triângulo está no interior do outro
  for (let i = 0; i < 3; i++) {
    if (isPointStrictlyInsideTriangle(triangleA[i], triangleB)) {
      return true;
    }
    if (isPointStrictlyInsideTriangle(triangleB[i], triangleA)) {
      return true;
    }
  }

  // 3. Verifica se o centroide de um triângulo está dentro do outro
  const centerA = calculateAnchorPoint(triangleA);
  const centerB = calculateAnchorPoint(triangleB);

  if (
    isPointStrictlyInsideTriangle(centerA, triangleB) ||
    isPointStrictlyInsideTriangle(centerB, triangleA)
  ) {
    return true;
  }

  return false;
};

export const triangulatePoints = (points: Matrix): Matrix[] => {
  const uniquePoints = removeDuplicatePoints(points);

  if (uniquePoints.length < 3) {
    return [];
  }

  if (uniquePoints.length === 3) {
    return [uniquePoints];
  }

  const remainingPoints = sortPointsByCentroidAngle(uniquePoints);
  const triangles: Matrix[] = [];

  let safetyCounter = 0;
  const maxIterations = remainingPoints.length * remainingPoints.length;

  while (remainingPoints.length > 3 && safetyCounter < maxIterations) {
    safetyCounter++;
    let earFound = false;
    const count = remainingPoints.length;

    for (let i = 0; i < count; i++) {
      const prevIndex = (i - 1 + count) % count;
      const nextIndex = (i + 1) % count;

      const prevPoint = remainingPoints[prevIndex];
      const currentPoint = remainingPoints[i];
      const nextPoint = remainingPoints[nextIndex];

      const determinant = calculateTriangleDeterminant(
        prevPoint,
        currentPoint,
        nextPoint,
      );

      if (determinant > 0.000001) {
        const candidateTriangle: Matrix = [prevPoint, currentPoint, nextPoint];
        let hasPointInside = false;

        for (let j = 0; j < count; j++) {
          if (j !== prevIndex && j !== i && j !== nextIndex) {
            const testPoint = remainingPoints[j];

            if (
              isPointStrictlyInsideTriangle(testPoint, candidateTriangle) ||
              isPointStrictlyOnSegment(testPoint, prevPoint, nextPoint) ||
              isPointStrictlyOnSegment(testPoint, prevPoint, currentPoint) ||
              isPointStrictlyOnSegment(testPoint, currentPoint, nextPoint)
            ) {
              hasPointInside = true;
              break;
            }
          }
        }

        if (!hasPointInside) {
          triangles.push(candidateTriangle);
          remainingPoints.splice(i, 1);
          earFound = true;
          break;
        }
      }
    }

    if (!earFound) {
      const fallbackTriangle: Matrix = [
        remainingPoints[0],
        remainingPoints[1],
        remainingPoints[2],
      ];

      if (calculateTriangleArea(fallbackTriangle) > 0.000001) {
        triangles.push(fallbackTriangle);
      }

      remainingPoints.splice(1, 1);
    }
  }

  if (remainingPoints.length === 3) {
    if (calculateTriangleArea(remainingPoints) > 0.000001) {
      triangles.push([
        remainingPoints[0],
        remainingPoints[1],
        remainingPoints[2],
      ]);
    }
  }

  return triangles;
};

export const groupPointsIntoTriangles = (points: Matrix): Matrix[] => {
  const triangles: Matrix[] = [];

  for (let i = 0; i + 2 < points.length; i += 3) {
    const triangle: Matrix = [points[i], points[i + 1], points[i + 2]];
    triangles.push(triangle);
  }

  return triangles;
};

const doTriangleGroupsIntersect = (
  groupA: Matrix[],
  groupB: Matrix[],
): boolean => {
  for (let i = 0; i < groupA.length; i++) {
    for (let j = 0; j < groupB.length; j++) {
      if (doTrianglesIntersect(groupA[i], groupB[j])) {
        return true;
      }
    }
  }

  return false;
};

export const buildNonIntersectingTriangles = (points: Matrix): Matrix[] => {
  const initialTriangles = groupPointsIntoTriangles(points);

  const pointGroups: Matrix[] = [];
  const triangleGroups: Matrix[][] = [];

  for (let i = 0; i < initialTriangles.length; i++) {
    pointGroups.push(initialTriangles[i]);
    triangleGroups.push([initialTriangles[i]]);
  }

  let hasMerged = true;

  while (hasMerged) {
    hasMerged = false;

    for (let i = 0; i < triangleGroups.length; i++) {
      for (let j = i + 1; j < triangleGroups.length; j++) {
        if (doTriangleGroupsIntersect(triangleGroups[i], triangleGroups[j])) {
          const mergedPoints: Matrix = [];

          for (let k = 0; k < pointGroups[i].length; k++) {
            mergedPoints.push(pointGroups[i][k]);
          }
          for (let k = 0; k < pointGroups[j].length; k++) {
            mergedPoints.push(pointGroups[j][k]);
          }

          pointGroups[i] = removeDuplicatePoints(mergedPoints);
          triangleGroups[i] = triangulatePoints(pointGroups[i]);

          pointGroups.splice(j, 1);
          triangleGroups.splice(j, 1);

          hasMerged = true;
          break;
        }
      }

      if (hasMerged) {
        break;
      }
    }
  }

  const finalTriangles: Matrix[] = [];

  for (let i = 0; i < triangleGroups.length; i++) {
    for (let j = 0; j < triangleGroups[i].length; j++) {
      finalTriangles.push(triangleGroups[i][j]);
    }
  }

  return finalTriangles;
};
