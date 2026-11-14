"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import type { Mode, ModeMap } from "@/types";
import TransformationForm from "@/components/TransformationForm"
import TransformationChart from "@/components/charts/TransformationChart"
import RegressionSettingsForm from "@/components/RegressionSettingsForm"
import RegressionChart from "@/components/charts/RegressionChart"
import TrianglesChart from "@/components/charts/TrianglesChart"

const initSelectedMode:Mode = "transformation";

interface ModeProviderType {
  children: ReactNode
}

interface ModeContextType {
  mode: Mode,
  modeConfig: ModeMap,
  setSelectedMode: (param: Mode) => void
}

const ModeContext = createContext<ModeContextType | null>(null)

const ModeProvider = ({ children }: ModeProviderType) => {
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
    triangles: {
      title: "Área do Triângulo",
      component: <h1>Triângulo</h1>,
      chart: <TrianglesChart></TrianglesChart>,
    },
  };

  return <ModeContext.Provider value={{ mode: selectedMode, modeConfig, setSelectedMode }}>
    { children }
  </ModeContext.Provider>
}

export default ModeProvider

export const useModeContext = () => {
  const context = useContext(ModeContext)

  if(!context){
    throw new Error("ERROR IN CONTEXT")
  }

  return context
}