"use client";

import { useState, ChangeEvent, SubmitEvent } from "react";
import type { RegressionType } from "@/types";
import { buildEquation, calculateRegressionImage } from "@/utils/regression";
import { useRegressionContext } from "@/context/RegressionContext";
import { isValidRegressionCoefficients } from "@/utils/validators";

const inputClassName =
  "w-full font-normal h-10 px-3 text-center bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring";

export default function RegressionSettingsForm() {
  const {
    regressionCoefficients,
    chosenRegression,
    variableLabels,
    estimationPoint,
    setEstimationPoint,
    setVariableLabels,
    setChosenRegression,
  } = useRegressionContext();

  const [form, setForm] = useState({
    dependent: variableLabels.dependent,
    independent: variableLabels.independent,
  });

  const [estimationInput, setEstimationInput] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleEstimationInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const targetValue = e.target.value.replace(",", ".");

    const regex = /^-?(\d+(\.\d*)?)?$/;

    if (regex.test(targetValue)) {
      setEstimationInput(targetValue);

      const estimationDraft = targetValue === "" ? null : Number(targetValue);
      setEstimationPoint(
        !Number.isNaN(estimationDraft) ? estimationDraft : null,
      );
    }
  };

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();

    setChosenRegression(e.target.value as RegressionType);
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setVariableLabels({
      dependent: form.dependent.trim(),
      independent: form.independent.trim(),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4 mb-6 border border-border rounded-md"
    >
      <label className="flex gap-5 font-semibold items-center text-xs">
        Variável dependente:
        <input
          type="text"
          id="dependent"
          value={form.dependent}
          placeholder="f(x)"
          className={inputClassName}
          onChange={handleInputChange}
        />
      </label>
      <label className="flex gap-5 font-semibold items-center text-xs">
        Variável independente:
        <input
          type="text"
          id="independent"
          value={form.independent}
          placeholder="x"
          className={inputClassName}
          onChange={handleInputChange}
        />
      </label>

      <label className="flex gap-5 font-semibold items-center text-xs">
        Ponto Estimado:
        <input
          type="text"
          id="estimationPoint"
          inputMode="decimal"
          placeholder="0"
          value={estimationInput}
          className={inputClassName}
          onChange={handleEstimationInputChange}
        />
      </label>

      <select
        id="axis"
        className={`${inputClassName} mb-5 cursor-pointer`}
        value={chosenRegression}
        onChange={handleSelectChange}
      >
        <option value="linear">Regressão Linear</option>
        <option value="quadratic">Regressão Quadrática</option>
        <option value="exponential">Regressão Exponencial</option>
      </select>

      {isValidRegressionCoefficients(regressionCoefficients) ? (
        <div className="flex flex-col gap-1.5">
          <p className="font-mono text-sm text-muted-foreground">
            {buildEquation(
              chosenRegression,
              regressionCoefficients,
              variableLabels.dependent || "f(x)",
              variableLabels.independent || "x",
            )}
          </p>
          {estimationPoint !== null && (
            <p className="font-mono text-sm text-amber-400">
              {`Estimativa (${variableLabels.independent || "x"} = ${estimationPoint}): ${Number(
                calculateRegressionImage(
                  chosenRegression,
                  regressionCoefficients,
                  estimationPoint,
                ).toFixed(2),
              )}`}
            </p>
          )}
        </div>
      ) : (
        <div
          role="alert"
          className="flex items-start gap-2.5 p-3 text-xs rounded-md bg-amber-500/10 border border-amber-500/30 text-amber-400"
        >
          <p className="leading-relaxed">
            Não é possível calcular a{" "}
            <span className="font-semibold">Regressão</span> com os pontos
            atuais.
            {chosenRegression === "exponential" &&
              " Valores de y devem ser maiores que zero."}
          </p>
        </div>
      )}

      <button className="h-10 px-4 bg-secondary text-secondary-foreground font-medium rounded-md hover:opacity-90 cursor-pointer">
        Aplicar
      </button>
    </form>
  );
}
