"use client"

import { useState, useEffect, useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip"

// Add custom screen size for extra small devices
const customStyles = `
  @media (min-width: 400px) {
    .xs\\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
`

// Update the DraggablePlanet component to be more compact on mobile
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

// Update the DroppableHouse component to enhance drop zone visibility
const DroppableHouse = ({ house, onDrop, children, isAscendant, onHouseClick, isDroppable, isHighlighted }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: "planet",
    drop: (item) => onDrop(house.house, item.planet),
    canDrop: () => isDroppable,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  }))

  const isActive = isOver && canDrop

  return (
    <div
      ref={drop}
      onClick={() => isDroppable && onHouseClick(house.house)}
      className={`
        border border-green-500 p-1 flex flex-col relative transition-all duration-200
        ${isAscendant ? "bg-yellow-50" : ""}
        ${isActive ? "bg-purple-100 ring-2 ring-purple-500 scale-105" : ""}
        ${isDroppable ? "cursor-pointer hover:bg-purple-50" : ""}
        ${isHighlighted ? "ring-2 ring-amber-400" : ""}
      `}
    >
      <div className="text-xs text-gray-600 self-start font-medium">{house.house}</div>
      {isDroppable && isOver && (
        <div className="absolute inset-0 bg-purple-200 bg-opacity-40 flex items-center justify-center pointer-events-none">
          <div className="text-purple-600 font-medium text-sm">Drop Here</div>
        </div>
      )}
      {children}
      {isAscendant && <div className="text-xs text-red-600 self-end">லக்</div>}
    </div>
  )
}

// Update the EditableHoroscopeChart component to receive control state from props
function EditableHoroscopeChart({
  chartData,
  chartType,
  onChartUpdate,
  // New props for control state
  editMode,
  selectedPlanet,
  setSelectedPlanet,
}) {
  // Remove the editMode and selectedPlanet state as they're now passed as props
  // const [editMode, setEditMode] = useState(false)
  // const [selectedPlanet, setSelectedPlanet] = useState(null)

  const [customPlanetPositions, setCustomPlanetPositions] = useState({})
  const [highlightedHouse, setHighlightedHouse] = useState(null)
  const chartRef = useRef(null)

  // Planet abbreviations for display in the chart
  const planetAbbreviations = {
    SUN: "சூ",
    MOON: "சந்",
    MARS: "செவ்",
    MERCURY: "புத",
    JUPITER: "குரு",
    VENUS: "சுக்",
    SATURN: "சனி",
    RAHU: "ராகு",
    KETU: "கேது",
  }

  // Planet names in Tamil and English
  const planetNames = {
    SUN: { tamil: "சூரியன்", english: "Sun" },
    MOON: { tamil: "சந்திரன்", english: "Moon" },
    MARS: { tamil: "செவ்வாய்", english: "Mars" },
    MERCURY: { tamil: "புதன்", english: "Mercury" },
    JUPITER: { tamil: "குரு", english: "Jupiter" },
    VENUS: { tamil: "சுக்கிரன்", english: "Venus" },
    SATURN: { tamil: "சனி", english: "Saturn" },
    RAHU: { tamil: "ராகு", english: "Rahu" },
    KETU: { tamil: "கேது", english: "Ketu" },
  }

  // Rasi (zodiac) names in Tamil and English
  const rasiNames = [
    { tamil: "மேஷம்", english: "Aries" },
    { tamil: "ரிஷபம்", english: "Taurus" },
    { tamil: "மிதுனம்", english: "Gemini" },
    { tamil: "கடகம்", english: "Cancer" },
    { tamil: "சிம்மம்", english: "Leo" },
    { tamil: "கன்னி", english: "Virgo" },
    { tamil: "துலாம்", english: "Libra" },
    { tamil: "விருச்சிகம்", english: "Scorpio" },
    { tamil: "தனுசு", english: "Sagittarius" },
    { tamil: "மகரம்", english: "Capricorn" },
    { tamil: "கும்பம்", english: "Aquarius" },
    { tamil: "மீனம்", english: "Pisces" },
  ]

  // Traditional South Indian chart layout (houses indexed from 1)
  const traditionalLayout = [
    // Houses 1-12
    { house: 1, row: 0, col: 3, planets: [] },
    { house: 2, row: 0, col: 2, planets: [] },
    { house: 3, row: 0, col: 1, planets: [] },
    { house: 4, row: 0, col: 0, planets: [] },
    { house: 5, row: 1, col: 0, planets: [] },
    { house: 6, row: 2, col: 0, planets: [] },
    { house: 7, row: 3, col: 0, planets: [] },
    { house: 8, row: 3, col: 1, planets: [] },
    { house: 9, row: 3, col: 2, planets: [] },
    { house: 10, row: 3, col: 3, planets: [] },
    { house: 11, row: 2, col: 3, planets: [] },
    { house: 12, row: 1, col: 3, planets: [] },
  ]

  // Calculate the ascendant house (lagna)
  const ascendantDegree = chartData?.ascendant?.degrees || 0
  const ascendantRasi = Math.floor(ascendantDegree / 30) % 12

  // Default planet positions based on chart type
  const getDefaultPlanetPositions = () => {
    if (chartType === "rasi") {
      return {
        SUN: 2, // Gemini (Mithunam)
        MOON: 11, // Aquarius (Kumbam)
        MARS: 12, // Pisces (Meenam)
        MERCURY: 1, // Taurus (Rishabam)
        JUPITER: 2, // Gemini (Mithunam)
        VENUS: 0, // Aries (Mesham)
        SATURN: 10, // Capricorn (Makaram)
        RAHU: 10, // Capricorn (Makaram)
        KETU: 4, // Cancer (Kadakam)
      }
    } else {
      return {
        SUN: 1, // Position for Navamsa
        MOON: 3, // Position for Navamsa
        MARS: 10, // Position for Navamsa
        MERCURY: 2, // Position for Navamsa
        JUPITER: 2, // Position for Navamsa
        VENUS: 0, // Position for Navamsa
        SATURN: 10, // Position for Navamsa
        RAHU: 8, // Position for Navamsa
        KETU: 2, // Position for Navamsa
      }
    }
  }

  // Get current planet positions (either custom or default)
  const getPlanetPositions = () => {
    const defaultPositions = getDefaultPlanetPositions()
    return { ...defaultPositions, ...customPlanetPositions }
  }

  // Assign planets to houses based on positions
  const assignPlanetsToHouses = () => {
    // Clear existing planets
    traditionalLayout.forEach((house) => {
      house.planets = []
    })

    const planetPositions = getPlanetPositions()

    // Assign planets to houses
    Object.entries(planetPositions).forEach(([planet, position]) => {
      const houseIndex = (position - ascendantRasi + 12) % 12
      const houseNumber = houseIndex + 1 // Convert to 1-indexed house number

      const house = traditionalLayout.find((h) => h.house === houseNumber)
      if (house) {
        house.planets.push(planet)
      }
    })
  }

  // Call the assignment function
  assignPlanetsToHouses()

  // Handle house click in edit mode
  const handleHouseClick = (houseNumber) => {
    if (!editMode || !selectedPlanet) return

    // Calculate the position based on house and ascendant
    const position = (houseNumber - 1 + ascendantRasi) % 12

    // Update the custom planet positions
    setCustomPlanetPositions((prev) => ({
      ...prev,
      [selectedPlanet]: position,
    }))

    // Notify parent component if callback provided
    if (onChartUpdate) {
      onChartUpdate({
        chartType,
        positions: {
          ...getPlanetPositions(),
          [selectedPlanet]: position,
        },
      })
    }

    // Clear selection after placing
    setSelectedPlanet(null)

    // Show a visual feedback of where planet was placed
    setHighlightedHouse(houseNumber)
    setTimeout(() => setHighlightedHouse(null), 1000)
  }

  // Handle drag and drop
  const handlePlanetDrop = (houseNumber, planet) => {
    // Calculate the position based on house and ascendant
    const position = (houseNumber - 1 + ascendantRasi) % 12

    // Update the custom planet positions
    setCustomPlanetPositions((prev) => ({
      ...prev,
      [planet]: position,
    }))

    // Notify parent component if callback provided
    if (onChartUpdate) {
      onChartUpdate({
        chartType,
        positions: {
          ...getPlanetPositions(),
          [planet]: position,
        },
      })
    }

    // Show a visual feedback of where planet was placed
    setHighlightedHouse(houseNumber)
    setTimeout(() => setHighlightedHouse(null), 1000)
  }

  // Get planet position display name
  const getPlanetPositionName = (position) => {
    const rasiIndex = position % 12
    return `${rasiNames[rasiIndex].tamil} (${rasiNames[rasiIndex].english})`
  }

  // Add custom styles to the component
  useEffect(() => {
    // Check if the style element already exists
    if (!document.getElementById("custom-xs-styles")) {
      const styleElement = document.createElement("style")
      styleElement.id = "custom-xs-styles"
      styleElement.innerHTML = customStyles
      document.head.appendChild(styleElement)

      // Clean up on unmount
      return () => {
        const existingStyle = document.getElementById("custom-xs-styles")
        if (existingStyle) {
          document.head.removeChild(existingStyle)
        }
      }
    }
  }, [])

  useEffect(() => {
    // Reset customPlanetPositions when chartData changes or when explicitly reset
    setCustomPlanetPositions({})
  }, [chartData, chartType])

  return (
    <TooltipProvider>
      <div className="w-full px-1 sm:px-0">
        {/* Chart Grid */}
        <div
          ref={chartRef}
          className="grid grid-cols-4 grid-rows-4 border-2 border-green-500 rounded-xl overflow-hidden aspect-square bg-green-50 max-w-[480px] mx-auto shadow-md"
        >
          {/* Top row (houses 4, 3, 2, 1) */}
          {traditionalLayout.slice(0, 4).map((house) => (
            <DroppableHouse
              key={`house-${house.house}`}
              house={house}
              onDrop={handlePlanetDrop}
              isAscendant={house.house === 1}
              onHouseClick={handleHouseClick}
              isDroppable={editMode}
              isHighlighted={house.house === highlightedHouse}
            >
              <div className="flex-grow flex flex-wrap content-center justify-center gap-1 p-1">
                {house.planets.map((planet) => (
                  <Tooltip key={planet}>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          text-[10px] sm:text-sm px-1 sm:px-1.5 py-0.5 rounded
                          ${editMode ? "cursor-pointer hover:bg-indigo-100" : ""}
                          ${selectedPlanet === planet ? "bg-indigo-100 text-indigo-800" : ""}
                        `}
                        onClick={(e) => {
                          if (editMode) {
                            e.stopPropagation()
                            setSelectedPlanet(planet)
                          }
                        }}
                      >
                        {planetAbbreviations[planet]}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {planetNames[planet].english} ({planetNames[planet].tamil})
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </DroppableHouse>
          ))}

          {/* Middle rows with center */}
          <DroppableHouse
            house={traditionalLayout[4]} // House 5
            onDrop={handlePlanetDrop}
            isAscendant={false}
            onHouseClick={handleHouseClick}
            isDroppable={editMode}
            isHighlighted={5 === highlightedHouse}
          >
            <div className="flex-grow flex flex-wrap content-center justify-center gap-1 p-1">
              {traditionalLayout
                .find((h) => h.house === 5)
                ?.planets.map((planet) => (
                  <Tooltip key={planet}>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          text-[10px] sm:text-sm px-1 sm:px-1.5 py-0.5 rounded
                          ${editMode ? "cursor-pointer hover:bg-indigo-100" : ""}
                          ${selectedPlanet === planet ? "bg-indigo-100 text-indigo-800" : ""}
                        `}
                        onClick={(e) => {
                          if (editMode) {
                            e.stopPropagation()
                            setSelectedPlanet(planet)
                          }
                        }}
                      >
                        {planetAbbreviations[planet]}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {planetNames[planet].english} ({planetNames[planet].tamil})
                    </TooltipContent>
                  </Tooltip>
                ))}
            </div>
          </DroppableHouse>

          {/* Center cell spanning 2x2 */}
          <div className="col-span-2 row-span-2 border border-green-600 flex items-center justify-center bg-white">
            <div className="text-center p-1 sm:p-2">
              <div className="text-lg sm:text-xl font-bold text-red-600 mb-0.5 sm:mb-1">
                {chartType === "rasi" ? "ராசி" : "நவாம்சம்"}
              </div>
              {chartType === "rasi" && (
                <div className="text-base sm:text-lg text-red-600">{chartData?.rasi || "கும்பம்"}</div>
              )}
              {editMode && (
                <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-indigo-600 bg-indigo-50 p-0.5 sm:p-1 rounded">
                  {selectedPlanet ? `Place ${planetNames[selectedPlanet].english}` : "Select planet"}
                </div>
              )}
            </div>
          </div>

          <DroppableHouse
            house={traditionalLayout[11]} // House 12
            onDrop={handlePlanetDrop}
            isAscendant={false}
            onHouseClick={handleHouseClick}
            isDroppable={editMode}
            isHighlighted={12 === highlightedHouse}
          >
            <div className="flex-grow flex flex-wrap content-center justify-center gap-1 p-1">
              {traditionalLayout
                .find((h) => h.house === 12)
                ?.planets.map((planet) => (
                  <Tooltip key={planet}>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          text-[10px] sm:text-sm px-1 sm:px-1.5 py-0.5 rounded
                          ${editMode ? "cursor-pointer hover:bg-indigo-100" : ""}
                          ${selectedPlanet === planet ? "bg-indigo-100 text-indigo-800" : ""}
                        `}
                        onClick={(e) => {
                          if (editMode) {
                            e.stopPropagation()
                            setSelectedPlanet(planet)
                          }
                        }}
                      >
                        {planetAbbreviations[planet]}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {planetNames[planet].english} ({planetNames[planet].tamil})
                    </TooltipContent>
                  </Tooltip>
                ))}
            </div>
          </DroppableHouse>

          <DroppableHouse
            house={traditionalLayout[5]} // House 6
            onDrop={handlePlanetDrop}
            isAscendant={false}
            onHouseClick={handleHouseClick}
            isDroppable={editMode}
            isHighlighted={6 === highlightedHouse}
          >
            <div className="flex-grow flex flex-wrap content-center justify-center gap-1 p-1">
              {traditionalLayout
                .find((h) => h.house === 6)
                ?.planets.map((planet) => (
                  <Tooltip key={planet}>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          text-[10px] sm:text-sm px-1 sm:px-1.5 py-0.5 rounded
                          ${editMode ? "cursor-pointer hover:bg-indigo-100" : ""}
                          ${selectedPlanet === planet ? "bg-indigo-100 text-indigo-800" : ""}
                        `}
                        onClick={(e) => {
                          if (editMode) {
                            e.stopPropagation()
                            setSelectedPlanet(planet)
                          }
                        }}
                      >
                        {planetAbbreviations[planet]}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {planetNames[planet].english} ({planetNames[planet].tamil})
                    </TooltipContent>
                  </Tooltip>
                ))}
            </div>
          </DroppableHouse>

          <DroppableHouse
            house={traditionalLayout[10]} // House 11
            onDrop={handlePlanetDrop}
            isAscendant={false}
            onHouseClick={handleHouseClick}
            isDroppable={editMode}
            isHighlighted={11 === highlightedHouse}
          >
            <div className="flex-grow flex flex-wrap content-center justify-center gap-1 p-1">
              {traditionalLayout
                .find((h) => h.house === 11)
                ?.planets.map((planet) => (
                  <Tooltip key={planet}>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          text-[10px] sm:text-sm px-1 sm:px-1.5 py-0.5 rounded
                          ${editMode ? "cursor-pointer hover:bg-indigo-100" : ""}
                          ${selectedPlanet === planet ? "bg-indigo-100 text-indigo-800" : ""}
                        `}
                        onClick={(e) => {
                          if (editMode) {
                            e.stopPropagation()
                            setSelectedPlanet(planet)
                          }
                        }}
                      >
                        {planetAbbreviations[planet]}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {planetNames[planet].english} ({planetNames[planet].tamil})
                    </TooltipContent>
                  </Tooltip>
                ))}
            </div>
          </DroppableHouse>

          {/* Bottom row (houses 7, 8, 9, 10) */}
          {traditionalLayout.slice(6, 10).map((house) => (
            <DroppableHouse
              key={`house-${house.house}`}
              house={house}
              onDrop={handlePlanetDrop}
              isAscendant={false}
              onHouseClick={handleHouseClick}
              isDroppable={editMode}
              isHighlighted={house.house === highlightedHouse}
            >
              <div className="flex-grow flex flex-wrap content-center justify-center gap-1 p-1">
                {house.planets.map((planet) => (
                  <Tooltip key={planet}>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          text-[10px] sm:text-sm px-1 sm:px-1.5 py-0.5 rounded
                          ${editMode ? "cursor-pointer hover:bg-indigo-100" : ""}
                          ${selectedPlanet === planet ? "bg-indigo-100 text-indigo-800" : ""}
                        `}
                        onClick={(e) => {
                          if (editMode) {
                            e.stopPropagation()
                            setSelectedPlanet(planet)
                          }
                        }}
                      >
                        {planetAbbreviations[planet]}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {planetNames[planet].english} ({planetNames[planet].tamil})
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </DroppableHouse>
          ))}
        </div>

        {/* Planet Positions Table */}
        <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm print:hidden">
          <h3 className="text-sm font-medium mb-3 text-gray-700">Current Planet Positions:</h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
            {Object.entries(getPlanetPositions()).map(([planet, position]) => {
              return (
                <div key={planet} className="flex items-center text-sm">
                  <div className="w-6 h-6 flex items-center justify-center mr-2 rounded-full bg-purple-100 text-purple-800 text-xs">
                    {planetAbbreviations[planet]}
                  </div>
                  <div className="truncate">
                    <span className="font-medium">{planetNames[planet].english}:</span>{" "}
                    <span className="text-gray-700 text-xs">{getPlanetPositionName(position)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default EditableHoroscopeChart

