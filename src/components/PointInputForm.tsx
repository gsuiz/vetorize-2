"use client";

import { useState, useRef, ChangeEvent, SubmitEvent } from "react";
import { usePoints } from "../context/PointsContext";

export default function PointInputForm() {
  const { addPoint } = usePoints();

  const xCoordinateInputRef = useRef<HTMLInputElement>(null);

  const [coordinateInputs, setCoordinateInputs] = useState<{ x: string; y: string }>({
    x: "",
    y: "",
  });
  const [validationError, setValidationError] = useState<string>("");

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if ( coordinateInputs.x.trim() === "" || coordinateInputs.y.trim() === "" ) return;

    addPoint(
      [
        Number(coordinateInputs.x),
        Number(coordinateInputs.y)
      ],
      setValidationError,
    );

    setCoordinateInputs({ x: "", y: "" });

    xCoordinateInputRef.current?.focus();
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const id: string = e.target.id;
    const value: string = e.target.value;

    setCoordinateInputs((prev) => ({ ...prev, [id]: value }));
    setValidationError("");
  };

  return (
    <div className="flex flex-col gap-4 mb-8">
      {validationError && <div className="text-red-500">Erro: {validationError}</div>}
      <form className="flex gap-4 items-end" onSubmit={handleSubmit}>
        {/* Caixa do X */}
        <div className="flex flex-col gap-1.5 w-full">
          <label
            htmlFor="x"
            className="text-sm font-semibold text-muted-foreground text-center"
          >
            X
          </label>
          <input
            id="x"
            type="number"
            step="any"
            value={coordinateInputs.x}
            onChange={handleChange}
            placeholder="0"
            ref={xCoordinateInputRef}
            className="w-full h-10 px-3 text-center bg-background border border-input rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
          />
        </div>

        {/* Caixa do Y */}
        <div className="flex flex-col gap-1.5 w-full">
          <label
            htmlFor="y"
            className="text-sm font-semibold text-muted-foreground text-center"
          >
            Y
          </label>
          <input
            id="y"
            type="number"
            step="any"
            value={coordinateInputs.y}
            onChange={handleChange}
            placeholder="0"
            className="w-full h-10 px-3 text-center bg-background border border-input rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring transition-all"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold opacity-0 select-none">
            T
          </label>
          <button
            disabled={coordinateInputs.x === "" || coordinateInputs.y === ""}
            className="h-10 px-4 bg-secondary hover:opacity-90 text-secondary-foreground font-medium rounded-md transition-all shadow-sm whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Adicionar Ponto
          </button>
        </div>
      </form>
    </div>
  );
}
