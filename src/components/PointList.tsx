"use client";

import { useState } from "react";
import { usePoints } from "../context/PointsContext";

export default function PointList() {
  const { points, removePoints } = usePoints()

  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedPointIndices, setSelectedPointIndices] = useState<number[]>([]);

  if (points.length === 0) return null;

  const toggleSelection = (index: number) => {
    if (selectedPointIndices.includes(index)) {
      setSelectedPointIndices(selectedPointIndices.filter((i) => i !== index));
    } else {
      setSelectedPointIndices([...selectedPointIndices, index]);
    }
  };

  const handleDelete = () => {
    removePoints(selectedPointIndices)
    setIsSelecting(false);
    setSelectedPointIndices([]);
  };

  const handleCancel = () => {
    setIsSelecting(false);
    setSelectedPointIndices([]);
  };

  return (
    <div className="mb-6 flex flex-col gap-2">
      
      <div className="flex justify-between items-center mb-1">
        <h3 className="text-sm font-semibold text-muted-foreground">Pontos registrados:</h3>
        
        {!isSelecting ? (
          <button 
            onClick={() => setIsSelecting(true)} 
            className="text-xs font-medium text-primary hover:underline cursor-pointer"
          >
            Selecionar
          </button>
        ) : (
          <div className="flex gap-3">
            <button 
              onClick={handleCancel} 
              className="text-xs font-medium text-muted-foreground hover:underline cursor-pointer"
            >
              Cancelar
            </button>
            <button 
              onClick={handleDelete} 
              disabled={selectedPointIndices.length === 0}
              className="text-xs font-bold text-destructive hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-opacity"
            >
              Excluir ({selectedPointIndices.length})
            </button>
          </div>
        )}
      </div>
      
    
      {points.map((point, index) => (
        <div 
          key={index} 
          onClick={() => isSelecting && toggleSelection(index)}
          className={`flex gap-4 items-center p-2 rounded-md border border-border bg-card shadow-sm transition-all ${
            isSelecting ? "cursor-pointer hover:border-primary" : ""
          } ${selectedPointIndices.includes(index) ? "ring-1 ring-primary" : ""}`}
        >
          
          {isSelecting && (
            <input 
              type="checkbox" 
              checked={selectedPointIndices.includes(index)}
              readOnly
              className="w-4 h-4 cursor-pointer accent-primary"
            />
          )}

          <span className="text-sm font-medium text-card-foreground">Ponto {index + 1}:</span>
          <span className="font-mono text-sm text-muted-foreground">x: {Number(point[0].toFixed(2))}</span>
          <span className="font-mono text-sm text-muted-foreground">y: {Number(point[1].toFixed(2))}</span>
        </div>
      ))}
    </div>
  );
}
