"use client";

import { useState, ChangeEvent, SubmitEvent } from "react";
import { useRegression } from "@/hooks/useRegression";
import type { RegressionType } from "@/types";
import { buildEquation } from "@/utils/regression";

const inputClassName =
  "w-full font-normal h-10 px-3 text-center bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring";

export default function RegressionSettingsForm() {
  const {
    regressionCoefficients,
    chosenRegression,
    variableLabels,
    setVariableLabels,
    setChosenRegression,
  } = useRegression();

  const [form, setForm] = useState({
    dependent: variableLabels.dependent,
    independent: variableLabels.independent,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
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

      <select
        id="axis"
        className={`${inputClassName} mb-5 cursor-pointer`}
        value={chosenRegression}
        onChange={handleSelectChange}
        defaultValue={"linear"}
      >
        <option value="linear">Regressão Linear</option>
        <option value="quadratic">Regressão Quadrática</option>
        <option value="exponential">Regressão Exponencial</option>
      </select>

      {regressionCoefficients ? (
        <p className="font-mono text-sm text-muted-foreground">
          {buildEquation(
            chosenRegression,
            regressionCoefficients,
          )}
        </p>
      ) : null}

      <button className="h-10 px-4 bg-secondary text-secondary-foreground font-medium rounded-md hover:opacity-90 cursor-pointer">
        Aplicar
      </button>
    </form>
  );
}
