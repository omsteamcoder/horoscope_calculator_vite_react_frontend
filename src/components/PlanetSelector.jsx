"use client"

import React from "react"
import { Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip"
import { useDrag } from 'react-dnd';

// DraggablePlanet component for selecting planets
const DraggablePlanet = ({ planet, abbreviation, isSelected, onClick, planetNames }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "planet",
    item: { planet },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          ref={drag}
          onClick={onClick}
          className={`
            px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
            ${isSelected ? "bg-purple-600 text-white shadow-md scale-110" : "bg-white border border-gray-200 hover:bg-gray-50"}
            ${isDragging ? "opacity-40 ring-2 ring-purple-300" : "opacity-100"}
            cursor-move select-none transform hover:scale-105
          `}
          style={{ cursor: "grab" }}
        >
          {abbreviation}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        {planetNames[planet].english} ({planetNames[planet].tamil})
      </TooltipContent>
    </Tooltip>
  )
}

export default function PlanetSelector({ 
  editMode, 
  selectedPlanet, 
  setSelectedPlanet, 
  planetAbbreviations,
  planetNames
}) {
  return (
    editMode && (
      <div className="mb-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm print:hidden">
        <h3 className="text-sm font-medium mb-3 text-gray-700">Select Planet:</h3>
        <div className="flex flex-wrap gap-2">
          {Object.keys(planetAbbreviations).map((planet) => (
            <DraggablePlanet
              key={planet}
              planet={planet}
              abbreviation={planetAbbreviations[planet]}
              isSelected={selectedPlanet === planet}
              onClick={() => setSelectedPlanet(selectedPlanet === planet ? null : planet)}
              planetNames={planetNames}
            />
          ))}
        </div>
      </div>
    )
  )
}
