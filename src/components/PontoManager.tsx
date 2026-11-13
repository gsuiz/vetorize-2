"use client";

import PontoInput from "./PontoInput";
import PontoList from "./PontoList";
import PontoTrans from "./PontoTrans";
import { ChangeEvent, JSX, useState } from "react"

type Mode = "transformation" | "triangle" | "regression"
type ModeTitle = "Transformações" | "Área do Triângulo" | "Regressão linear" 

type ModeMap = Record<Mode, { title: ModeTitle, component: JSX.Element }>

export default function PontoManager() {

  const initSelectedMode = "transformation"

  const [selectedMode, setSelectedMode] = useState<Mode>(initSelectedMode)

  const modeConfig:ModeMap = { 
    transformation: { title: "Transformações", component: <PontoTrans></PontoTrans> },
    regression: { title: "Área do Triângulo", component: <h1>triangulo</h1> },
    triangle: { title: "Regressão linear", component: <h1>Regressão</h1> }
  }

  const activeTitle: string = modeConfig[selectedMode].title
  const activeComponent: JSX.Element = modeConfig[selectedMode].component

  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => { setSelectedMode(e.target.value as Mode) }

  const campo =
  "w-full font-normal h-10 px-3 text-center bg-background border border-input rounded-md focus:outline-none focus:ring-1 focus:ring-ring mb-10 cursor-pointer";

  return (
    <aside className="h-screen w-80 bg-background border-r border-border flex flex-col p-6 shadow-lg z-10 shrink-0 transition-colors duration-200">
      <select
          id="axis"
          className={campo}
          value={selectedMode}
          onChange={handleSelectChange}
        >
          <option value="transformation">Transformações</option>
          <option value="triangle">Área do Triângulo</option>
          <option value="regression">Regressão linear</option>
      </select>

      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-foreground">
            { activeTitle }
          </h2>
        </div>
        { activeComponent }
        {/* <PontoTrans/> */}
        <PontoInput />

        <PontoList />
      </div>
    </aside>
  );
}
