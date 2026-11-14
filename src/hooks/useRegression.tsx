"use client";

import { useState, useMemo } from "react";
import { usePoints } from "@/context/PointsContext";
import { calcularRegressao } from "@/utils/regression";

interface Variaveis {
  dependente: string;
  independente: string;
}

export function useRegressao() {
  const { points } = usePoints();

  const [variaveis, setVariaveis] = useState<Variaveis>({
    dependente: "",
    independente: "",
  });

  // derivado dos pontos: recalcula só quando points muda
  const reta = useMemo(() => calcularRegressao(points), [points]);

  return { reta, variaveis, setVariaveis }
} 