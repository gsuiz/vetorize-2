import type { Matrix, LinearRegressionCoefficients } from "@/types";

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
