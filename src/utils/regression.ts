import type { Matrix, LinearRegressionCoefficients, QuadraticRegressionCoefficients, ExponencialRegressionCoeficientes } from "@/types";
import { calculateDeterminant3x3 } from "./matrix";

export const calculateLinearRegression = (points: Matrix): LinearRegressionCoefficients | null => {
  const n = points.length; 

  if (n < 2) {
    return null;
  }

  let sumX = 0;  
  let sumY = 0; 
  let sumXX = 0; 
  let sumXY = 0; 

  for (const [x, y] of points) {
    sumX += x;
    sumY += y;
    sumXX += x * x;
    sumXY += x * y;
  }

  const determinant = n * sumXX - sumX * sumX;
  if (determinant === 0) {
    return null;
  }

  const slope = (n * sumXY - sumX * sumY) / determinant; 
  const intercept = (sumY - slope * sumX) / n; 
  return { intercept, slope };
};


export const calculateExpoRegression = (points: Matrix): ExponencialRegressionCoeficientes | null => {
  const n = points.length; 

  if (n < 2) {
    return null;
  }

  let sumX = 0;  
  let sumLogY = 0; 
  let sumXX = 0; 
  let sumXLogY = 0; 

  for (const [x, y] of points) {
    sumX += x;
    sumLogY += Math.log(y);
    sumXX += x * x;
    sumXLogY += x * Math.log(y);
  }

  const determinant = n * sumXX - sumX * sumX;
  if (determinant === 0) {
    return null;
  }

  const slope = (n * sumXLogY - sumX * sumLogY) / determinant; 
  const intercept =  Math.exp((sumLogY - slope * sumX) / n); 
  return {intercept, slope}
}

export const calculateQuadraticRegression = (points: Matrix): QuadraticRegressionCoefficients | null | 0 => {
  const n = points.length;
  if(n < 3) return 0;

  let sumX = 0
  let sumX2 = 0
  let sumX3 = 0
  let sumX4 = 0
  let sumY = 0
  let sumXY= 0
  let sumX2Y= 0

  for (const [x,y] of points){
    sumX +=x
    sumX2 += x*x
    sumX3 += x*x*x
    sumX4 += x*x*x*x
    sumY += y
    sumXY+= x*y
    sumX2Y+= x*x*y
  }

  const determinant= calculateDeterminant3x3([
    [n, sumX, sumX2],
    [sumX, sumX2, sumX3],
    [sumX2, sumX3, sumX4]
  ])
  

  if( determinant == 0) return 0;


  const determinantC = calculateDeterminant3x3([
    [sumY, sumX, sumX2],
    [sumXY, sumX2, sumX3],
    [sumX2Y, sumX3, sumX4],
  ]);

  const determinantB = calculateDeterminant3x3([
    [n, sumY, sumX2],
    [sumX, sumXY, sumX3],
    [sumX2, sumX2Y, sumX4],
  ]);

  const determinantA = calculateDeterminant3x3([
    [n, sumX, sumY],
    [sumX, sumX2, sumXY],
    [sumX2, sumX3, sumX2Y],
  ]);

  const intercept = determinantC /determinant
  const slope = determinantB/determinant
  const curvature = determinantA/determinant
  return {curvature,intercept,slope}
}
