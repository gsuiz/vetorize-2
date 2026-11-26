import type {
  Matrix,
  Vector,
  Mode,
  RegressionType,
  RegressionCoefficients,
} from "../types";

export const isValidNumber = (param: unknown): param is number => {
  if (
    typeof param === "number" &&
    !Number.isNaN(param) &&
    Number.isFinite(param)
  ) {
    return true;
  }
  return false;
};

export const isVector = (param: unknown): param is Vector => {
  if (!Array.isArray(param) || param.length !== 2) {
    return false;
  }

  return isValidNumber(param[0]) && isValidNumber(param[1]);
};

export const isMatrix = (param: unknown): param is Matrix => {
  if (!Array.isArray(param)) {
    return false;
  }

  for (let i = 0; i < param.length; i++) {
    if (!isVector(param[i])) {
      return false;
    }
  }

  return true;
};

export const isMode = (param: unknown): param is Mode => {
  if (
    param === "transformation" ||
    param === "triangles" ||
    param === "regression"
  ) {
    return true;
  }
  return false;
};

export const isRegressionType = (param: unknown): param is RegressionType => {
  if (param === "linear" || param === "exponential" || param === "quadratic") {
    return true;
  }
  return false;
};

export const isValidRegressionCoefficients = (
  param: unknown,
): param is RegressionCoefficients => {
  if (!param || typeof param !== "object") {
    return false;
  }

  const coefficients = param as Record<string, unknown>;

  if (
    isValidNumber(coefficients["slope"]) &&
    isValidNumber(coefficients["intercept"]) &&
    (isValidNumber(coefficients["curvature"]) ||
      coefficients["curvature"] === null)
  ) {
    return true;
  }

  return false;
};
