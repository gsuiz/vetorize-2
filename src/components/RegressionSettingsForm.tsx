"use client";

import { useState, ChangeEvent, SubmitEvent } from "react";
import { useRegression } from "@/hooks/useRegression";

const inputClassName =
  "w-full font-normal h-10 px-3 text-center bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring";

export default function RegressionSettingsForm() {
  const { regressionCoefficients, variableLabels, setVariableLabels } = useRegression();

  const [form, setForm] = useState({
    dependent: variableLabels.dependent,
    independent: variableLabels.independent,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setVariableLabels({
      dependent: form.dependent.trim(),
      independent: form.independent.trim(),
    });
  };

  const dependentVariableLabel = variableLabels.dependent || "f(x)";
  const independentVariableLabel = variableLabels.independent || "x";

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
          onChange={handleChange}
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
          onChange={handleChange}
        />
      </label>

      {regressionCoefficients && (
        <p className="font-mono text-sm text-muted-foreground">
          {dependentVariableLabel} = {Number(regressionCoefficients.slope.toFixed(4))}·{independentVariableLabel}{" "}
          {regressionCoefficients.intercept < 0 ? "-" : "+"} {Math.abs(Number(regressionCoefficients.intercept.toFixed(4)))}
        </p>
      )}

      <button className="h-10 px-4 bg-secondary text-secondary-foreground font-medium rounded-md hover:opacity-90 cursor-pointer">
        Aplicar
      </button>
    </form>
  );
}
