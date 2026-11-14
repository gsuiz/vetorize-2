"use client";

import PointInputForm from "./PointInputForm";
import PointList from "./PointList";
import type { JSX, ChangeEvent } from "react";
import type { Mode } from "@/types";

interface GeometrySidebarProps {
  activeTitle: string;
  activeComponent: JSX.Element;
  selectedMode: Mode;
  handleSelectChange: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export default function GeometrySidebar({
  activeTitle,
  activeComponent,
  selectedMode,
  handleSelectChange,
}: GeometrySidebarProps) {
  const selectClassName =
    "w-full font-normal h-10 px-3 text-center bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring mb-10 cursor-pointer";

  return (
    <aside className="h-screen w-80 bg-background border-r border-border flex flex-col p-6 shadow-lg z-10 shrink-0 transition-colors duration-200">
      <select
        id="axis"
        className={selectClassName}
        value={selectedMode}
        onChange={handleSelectChange}
      >
        <option value="transformation">Transformações</option>
        <option value="triangle">Área do Triângulo</option>
        <option value="regression">Regressão linear</option>
      </select>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-foreground">{activeTitle}</h2>
        </div>
        {activeComponent}
        <PointInputForm />

        <PointList />
      </div>
    </aside>
  );
}
