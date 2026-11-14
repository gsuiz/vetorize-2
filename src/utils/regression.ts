import type { Matrix, LinearRegressionCoefficients } from "@/types";
import { transpose, multiplyMatrices, calculateInverse } from "@/utils/matrix";

/**
 * Mínimos quadrados pela equação normal: β = (XᵀX)⁻¹ Xᵀy
 * Retorna null se não for possível calcular (menos de 2 pontos ou todos com o mesmo x).
 */
export const calculateLinearRegression = (points: Matrix): LinearRegressionCoefficients | null => {
  if (points.length < 2) {
    return null;
  }

  const designMatrix = points.map(([x]) => [1, x]);
  const observedValues = points.map(([, y]) => [y]);

  const transposedDesignMatrix = transpose(designMatrix);
  const normalMatrix = multiplyMatrices(transposedDesignMatrix, designMatrix);

  const determinant = normalMatrix[0][0] * normalMatrix[1][1] - normalMatrix[0][1] * normalMatrix[1][0];
  if (determinant === 0) {
    return null;
  }

  const coefficientMatrix = multiplyMatrices(
    multiplyMatrices(calculateInverse(normalMatrix as Matrix), transposedDesignMatrix),
    observedValues,
  );

  return { intercept: coefficientMatrix[0][0], slope: coefficientMatrix[1][0] };
};
