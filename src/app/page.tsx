"use client";

import GeometrySidebar from "../components/GeometrySidebar";
import TransformationChart from "../components/charts/TransformationChart";
import RegressionSettingsForm from "@/components/RegressionSettingsForm";
import RegressionChart from "@/components/charts/RegressionChart";
import TransformationForm from "@/components/TransformationForm";
import type { Mode, ModeTitle } from "@/types";
import { ChangeEvent, JSX, useState } from "react";

type ModeMap = Record<
  Mode,
  { title: ModeTitle; component: JSX.Element; chart: JSX.Element }
>;

export default function Page() {
  const initSelectedMode = "transformation";

  const [selectedMode, setSelectedMode] = useState<Mode>(initSelectedMode);

  const modeConfig: ModeMap = {
    transformation: {
      title: "Transformações",
      component: <TransformationForm></TransformationForm>,
      chart: <TransformationChart></TransformationChart>,
    },
    regression: {
      title: "Regressão linear",
      component: <RegressionSettingsForm></RegressionSettingsForm>,
      chart: <RegressionChart></RegressionChart>,
    },
    triangle: {
      title: "Área do Triângulo",
      component: <h1>Triângulo</h1>,
      chart: <h1>chart</h1>,
    },
  };

  const activeTitle: string = modeConfig[selectedMode].title;
  const activeComponent: JSX.Element = modeConfig[selectedMode].component;
  const activeChart: JSX.Element = modeConfig[selectedMode].chart;

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedMode(e.target.value as Mode);
  };

  return (
    <div className="h-screen flex w-full">
      <GeometrySidebar
        activeComponent={activeComponent}
        activeTitle={activeTitle}
        selectedMode={selectedMode}
        handleSelectChange={handleSelectChange}
      />

      <main className="flex-1 p-8 w-full h-full bg-background flex items-center justify-center">
        <div className="w-full h-full max-w-6xl max-h-[800px]">
          {activeChart}
        </div>
      </main>
    </div>
  );
}
