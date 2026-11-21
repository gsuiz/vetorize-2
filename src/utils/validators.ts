import { Matrix, Vector, Mode, RegressionType } from "../types";

export const isVector = (param: unknown): param is Vector => {
  if (
    Array.isArray(param) &&
    param.length === 2 &&
    param.every((item) => typeof item === "number")
  ) {
    return true;
  }
  return false;
};

export const isMatrix = (param: unknown): param is Matrix => {
  if (Array.isArray(param) && param.every((item) => isVector(item))) {
    return true;
  }
  return false;
};

export const isMode = (param: unknown): param is Mode => {
  if(param === "transformation" || param === "triangles" || param === "regression"){
    return true
  }
  return false
} 

export const isRegressionType = (param: unknown): param is RegressionType => {
  if(param === "linear" || param === "exponential" || param === "quadratic"){
    return true
  }
  return false
}
