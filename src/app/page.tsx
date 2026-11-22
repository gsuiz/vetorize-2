"use client";

import { JSX } from "react";
import { useModeContext } from "@/context/ModeContext";
import GeometrySidebar from "@/components/GeometrySidebar"

export default function Page() {

  const { mode, modeConfig } = useModeContext()
  
  const activeTitle: string = modeConfig[mode].title;
  const activeComponent: JSX.Element = modeConfig[mode].component;
  const activeChart: JSX.Element = modeConfig[mode].chart;

  return (
    <div className="h-screen flex w-full">
      <GeometrySidebar
        activeComponent={activeComponent}
        activeTitle={activeTitle}
      />

      <main className="flex-1 p-8 w-full h-full bg-background flex flex-col items-center justify-center">
        <div className="w-full h-full max-w-8xl max-h-[1000px]">
          {activeChart}
        </div>
      </main>
    </div>
  );
}
