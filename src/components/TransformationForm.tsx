"use client";

import { useState, ChangeEvent, SubmitEvent } from "react";
import { usePoints } from "@/context/PointsContext";
import useTransformation from "@/hooks/useTransformations";
import type { Transformation } from "@/types";

const inputClassName =
  "w-full font-normal h-10 px-3 text-center bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring";

export default function TransformationForm() {
  const { points, transformationUndoStack } = usePoints();
  const { applyTransformation, undoTransformation } = useTransformation()

  const [form, setForm] = useState({
    rotation: false,
    scale: false,
    reflection: false,
    angle: "",
    sx: "",
    sy: "",
    axis: "x",
    anchorX: "",
    anchorY: "",
  });

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { id, type, value } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setForm((prev) => ({
      ...prev,
      [id]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const transformation: Transformation = {
      rotation: form.rotation ? Number(form.angle) : null,
      scale: form.scale ? { sx: Number(form.sx), sy: Number(form.sy) } : null,
      reflection: form.reflection ? form.axis : null,
      anchor:
        form.anchorX && form.anchorY
          ? [Number(form.anchorX), Number(form.anchorY)]
          : null,
    };

    applyTransformation(transformation);
    setForm({
      rotation: false,
      scale: false,
      reflection: false,
      angle: "",
      sx: "",
      sy: "",
      axis: "x",
      anchorX: "",
      anchorY: "",
    });
  };

  const allowUndo = transformationUndoStack.length > 0;

  const nothingSelected =
    (!form.rotation && !form.scale && !form.reflection) || points.length === 0;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 p-4   mb-6 border border-border rounded-md"
    >
      {/* Rotação */}
      <label className="flex items-center gap-2 font-semibold">
        <input
          id="rotation"
          type="checkbox"
          checked={form.rotation}
          onChange={handleChange}
          className="accent-primary"
        />
        Rotação
      </label>
      {form.rotation && (
        <input
          id="angle"
          type="number"
          step="any"
          value={form.angle}
          onChange={handleChange}
          placeholder="Ângulo (graus)"
          className={inputClassName}
          required={true}
        />
      )}
      {/* Escala */}
      <label className="flex items-center gap-2 font-semibold">
        <input
          id="scale"
          type="checkbox"
          checked={form.scale}
          onChange={handleChange}
          className="accent-primary"
        />
        Escala
      </label>
      {form.scale && (
        <div className="flex gap-4">
          <input
            id="sx"
            type="number"
            step="any"
            value={form.sx}
            onChange={handleChange}
            placeholder="Sx"
            className={inputClassName}
            required={true}
          />
          <input
            id="sy"
            type="number"
            step="any"
            value={form.sy}
            onChange={handleChange}
            placeholder="Sy"
            className={inputClassName}
            required={true}
          />
        </div>
      )}

      {/* Reflexão */}
      <label className="flex items-center gap-2 font-semibold">
        <input
          id="reflection"
          type="checkbox"
          checked={form.reflection}
          onChange={handleChange}
          className="accent-primary"
        />
        Reflexão
      </label>
      {form.reflection && (
        <select
          id="axis"
          value={form.axis}
          onChange={handleChange}
          className={inputClassName}
        >
          <option value="x">Eixo X</option>
          <option value="y">Eixo Y</option>
          <option value="origin">Origem</option>
        </select>
      )}
      <label className="flex gap-5 font-semibold items-center">
        Âncora:
        <div className="flex gap-2">
          <input
            type="number"
            step="any"
            id="anchorX"
            value={form.anchorX}
            placeholder="x"
            className={inputClassName}
            onChange={handleChange}
          />
          <input
            type="number"
            step="any"
            id="anchorY"
            value={form.anchorY}
            placeholder="y"
            className={inputClassName}
            onChange={handleChange}
          />
        </div>
      </label>
      <div className="flex gap-4">
        <button
          disabled={nothingSelected}
          className="h-10 px-4 bg-secondary text-secondary-foreground font-medium rounded-md hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Aplicar
        </button>
        <button
          type="button"
          className=" text-secondary-foreground font-medium rounded-md hover:opacity-90 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={undoTransformation}
          disabled={!allowUndo}
        >
          Reverter
        </button>
      </div>
    </form>
  );
}
