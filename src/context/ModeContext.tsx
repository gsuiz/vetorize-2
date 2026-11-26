"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Mode, ModeMap } from "@/types";
import { isMode } from "@/utils/validators";
import TransformationForm from "@/components/TransformationForm";
import TransformationChart from "@/components/charts/TransformationChart";
import RegressionSettingsForm from "@/components/RegressionSettingsForm";
import RegressionChart from "@/components/charts/RegressionChart";
import TrianglesChart from "@/components/charts/TrianglesChart";
import TriangleSummary from "@/components/TrianglesSummary";

interface ModeProviderType {
  children: ReactNode;
}

interface ModeContextType {
  mode: Mode;
  modeConfig: ModeMap;
  setSelectedMode: (param: Mode) => void;
}

const ModeContext = createContext<ModeContextType | null>(null);

const getStoredMode = (): Mode => {
  if (typeof window === "undefined") {
    return "transformation";
  }

  try {
    const storedMode = localStorage.getItem("mode");

    return isMode(storedMode) ? storedMode : "transformation";
  } catch (err) {
    throw new Error(`Error during recovery from stored mode: ${err}`);
  }
};

const ModeProvider = ({ children }: ModeProviderType) => {
  const savedMode = getStoredMode();

  const [trianglesTotalArea, setTrianglesTotalArea] = useState<number>(0);
  const [selectedMode, setSelectedMode] = useState<Mode>(savedMode);

  useEffect(() => {
    localStorage.setItem("mode", selectedMode);
  }, [selectedMode]);

  const modeConfig: ModeMap = {
    transformation: {
      title: "Transformações",
      component: <TransformationForm></TransformationForm>,
      chart: <TransformationChart></TransformationChart>,
    },
    regression: {
      title: "Regressão",
      component: <RegressionSettingsForm></RegressionSettingsForm>,
      chart: <RegressionChart></RegressionChart>,
    },
    triangles: {
      title: "Área do Triângulo",
      component: <TriangleSummary trianglesTotalArea={trianglesTotalArea} />,
      chart: (
        <TrianglesChart changeTrianglesTotalArea={setTrianglesTotalArea} />
      ),
    },
  };

  return (
    <ModeContext.Provider
      value={{ mode: selectedMode, modeConfig, setSelectedMode }}
    >
      {children}
    </ModeContext.Provider>
  );
};

export default ModeProvider;

export const useModeContext = () => {
  const context = useContext(ModeContext);

  if (!context) {
    throw new Error("ERROR IN CONTEXT");
  }

  return context;
};
