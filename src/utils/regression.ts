import type { Matrix, LinearRegressionCoefficients, QuadraticRegressionCoefficients } from "@/types";
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
export const calculateExpoRegression = (points: Matrix): LinearRegressionCoefficients | null => {
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
  return null
}

export const calculateQuadraticRegression = (points: Matrix): QuadraticRegressionCoefficients | null => {
  const n = points.length;
  if(n < 2) return null;

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
  


  
  const slope = sumX2Y/determinant
  const intercept = sumXY /determinant
  const curvature = sumX/determinant
  return {curvature,intercept,slope}
}
