"use client"

import { useState, useEffect, useRef } from "react"
import { useDrag, useDrop } from "react-dnd"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "./Tooltip"

// Custom styles for extra small devices
const customStyles = `
  @media (min-width: 400px) {
    .xs\\:grid-cols-2 {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }
`

// Draggable planet component for planets
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

// Droppable house component
const DroppableHouse = ({
  house,
  onDrop,
  children,
  isAscendant,
  onHouseClick,
  isDroppable,
  isHighlighted,
  rasiName,
}) => {
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
      style={{
        gridColumnStart: house.col + 1,
        gridRowStart: house.row + 1,
      }}
    >
      <div className="text-xs text-gray-600 self-start font-medium">{house.house}</div>
      <div className="text-xs text-green-700 self-start font-medium">{rasiName}</div>
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

// The main HoroscopeChart component
function EditableHoroscopeChart({ chartData, chartType, onChartUpdate, editMode, selectedPlanet, setSelectedPlanet }) {
  const [customPlanetPositions, setCustomPlanetPositions] = useState({})
  const [highlightedHouse, setHighlightedHouse] = useState(null)
  const chartRef = useRef(null)

  // Define planet abbreviations
  const planetAbbreviations = {
    சூரியன்: "சூ", // Sun
    சந்திரன்: "சந்", // Moon
    செவ்வாய்: "செவ்", // Mars
    புதன்: "புத", // Mercury
    குரு: "குரு", // Jupiter
    சுக்ரன்: "சுக்", // Venus
    சனி: "சனி", // Saturn
    ராகு: "ராகு", // Rahu
    கேது: "கேது", // Ketu
  }

  // Map Tamil planet names to English codes (used for internal tracking)
  const planetCodes = {
    சூரியன்: "SUN",
    சந்திரன்: "MOON",
    செவ்வாய்: "MARS",
    புதன்: "MERCURY",
    குரு: "JUPITER",
    சுக்ரன்: "VENUS",
    சனி: "SATURN",
    ராகு: "RAHU",
    கேது: "KETU",
    லக்னம்: "ASC",
  }

  // Reverse map for looking up Tamil names
  const planetNames = {
    SUN: { tamil: "சூரியன்", english: "Sun" },
    MOON: { tamil: "சந்திரன்", english: "Moon" },
    MARS: { tamil: "செவ்வாய்", english: "Mars" },
    MERCURY: { tamil: "புதன்", english: "Mercury" },
    JUPITER: { tamil: "குரு", english: "Jupiter" },
    VENUS: { tamil: "சுக்ரன்", english: "Venus" },
    SATURN: { tamil: "சனி", english: "Saturn" },
    RAHU: { tamil: "ராகு", english: "Rahu" },
    KETU: { tamil: "கேது", english: "Ketu" },
    ASC: { tamil: "லக்னம்", english: "Ascendant" },
  }

  // Rasi (zodiac) names in Tamil
  const rasiOrder = [
    "மேஷம்", // Aries
    "ரிஷபம்", // Taurus
    "மிதுனம்", // Gemini
    "கடகம்", // Cancer
    "சிம்மம்", // Leo
    "கன்னி", // Virgo
    "துலாம்", // Libra
    "விருச்சிகம்", // Scorpio
    "தனுசு", // Sagittarius
    "மகரம்", // Capricorn
    "கும்பம்", // Aquarius
    "மீனம்", // Pisces
  ]

  // English rasi names for reference
  const rasiOrderEnglish = [
    "Aries",
    "Taurus",
    "Gemini",
    "Cancer",
    "Leo",
    "Virgo",
    "Libra",
    "Scorpio",
    "Sagittarius",
    "Capricorn",
    "Aquarius",
    "Pisces",
  ]

  // Tamil rasi names to index mapping for calculations
  const rasiIndices = {
    மேஷம்: 0,
    ரிஷபம்: 1,
    மிதுனம்: 2,
    கடகம்: 3,
    சிம்மம்: 4,
    கன்னி: 5,
    துலாம்: 6,
    விருச்சிகம்: 7,
    தனுசு: 8,
    மகரம்: 9,
    கும்பம்: 10,
    மீனம்: 11,
  }

  // Fixed traditional layout based on the image provided
  // This layout matches the standard South Indian chart format
  const traditionalLayout = [
    { house: 1, row: 0, col: 1, planets: [] }, // Aries (top row, second from left)
    { house: 2, row: 0, col: 2, planets: [] }, // Taurus (top row, third from left)
    { house: 3, row: 0, col: 3, planets: [] }, // Gemini (top row, rightmost)
    { house: 4, row: 1, col: 3, planets: [] }, // Cancer (right column, top)
    { house: 5, row: 2, col: 3, planets: [] }, // Leo (right column, middle)
    { house: 6, row: 3, col: 3, planets: [] }, // Virgo (right column, bottom)
    { house: 7, row: 3, col: 2, planets: [] }, // Libra (bottom row, third from left)
    { house: 8, row: 3, col: 1, planets: [] }, // Scorpio (bottom row, second from left)
    { house: 9, row: 3, col: 0, planets: [] }, // Sagittarius (bottom row, leftmost)
    { house: 10, row: 2, col: 0, planets: [] }, // Capricorn (left column, bottom)
    { house: 11, row: 1, col: 0, planets: [] }, // Aquarius (left column, middle)
    { house: 12, row: 0, col: 0, planets: [] }, // Pisces (left column, top)
  ]

  // Fixed mapping of houses to rasis based on the traditional layout
  const fixedHouseToRasiMap = {
    1: "மேஷம்", // Aries
    2: "ரிஷபம்", // Taurus
    3: "மிதுனம்", // Gemini
    4: "கடகம்", // Cancer
    5: "சிம்மம்", // Leo
    6: "கன்னி", // Virgo
    7: "துலாம்", // Libra
    8: "விருச்சிகம்", // Scorpio
    9: "தனுசு", // Sagittarius
    10: "மகரம்", // Capricorn
    11: "கும்பம்", // Aquarius
    12: "மீனம்", // Pisces
  }

  // Always use the main lagna rasi for both charts to maintain consistency
  const lagnaRasi = chartData?.Lagna || "கடகம்" // Default to Cancer if no data
  const ascendantRasi = rasiIndices[lagnaRasi]

  // Get the house assignments for either rasi or navamsa chart
  const getHouseAssignments = () => {
    if (!chartData) return {}

    // Choose the correct house data based on chart type
    const houseData = chartType === "rasi" ? chartData.rasi_houses : chartData.navamsa_houses

    if (!houseData) return {}

    // Create a mapping of house numbers to planet arrays
    const assignments = {}

    // For each house, find the corresponding rasi and get its planets
    Object.entries(fixedHouseToRasiMap).forEach(([houseNumber, rasi]) => {
      if (houseData[rasi]) {
        assignments[houseNumber] = houseData[rasi].map((planet) => planetCodes[planet] || planet)
      } else {
        assignments[houseNumber] = []
      }
    })

    return assignments
  }

  // Assign planets to houses based on the chart type
  const assignPlanetsToHouses = () => {
    // Clear existing planets
    traditionalLayout.forEach((house) => {
      house.planets = []
    })

    // Get house assignments for current chart type
    const houseAssignments = getHouseAssignments()

    // Assign planets to houses
    Object.entries(houseAssignments).forEach(([houseNumber, planets]) => {
      const house = traditionalLayout.find((h) => h.house === Number.parseInt(houseNumber))
      if (house && Array.isArray(planets)) {
        house.planets = planets.filter(Boolean) // Filter out any empty strings
      }
    })

    // Apply any custom positions from edit mode
    Object.entries(customPlanetPositions).forEach(([planet, position]) => {
      // Find which house this position corresponds to
      const houseNumber = ((position - ascendantRasi + 12) % 12) + 1

      // Remove planet from all houses first (to avoid duplicates)
      traditionalLayout.forEach((house) => {
        house.planets = house.planets.filter((p) => p !== planet)
      })

      // Add planet to the new house
      const targetHouse = traditionalLayout.find((h) => h.house === houseNumber)
      if (targetHouse) {
        targetHouse.planets.push(planet)
      }
    })
  }

  // Execute the assignment function
  assignPlanetsToHouses()

  // Find which house contains the lagna (ascendant)
  const findLagnaHouse = () => {
    // Find the house that contains ASC (lagna)
    for (const house of traditionalLayout) {
      if (house.planets.includes("ASC")) {
        return house.house
      }
    }
    // If not found in planets, it should be in house 1 by default
    return 1
  }

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
          ...customPlanetPositions,
          [selectedPlanet]: position,
        },
      })
    }

    // Clear selection after placing
    setSelectedPlanet(null)

    // Show visual feedback
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
          ...customPlanetPositions,
          [planet]: position,
        },
      })
    }

    // Show visual feedback
    setHighlightedHouse(houseNumber)
    setTimeout(() => setHighlightedHouse(null), 1000)
  }

  // Get planet position display name
  const getPlanetPositionName = (position) => {
    const rasiIndex = position % 12
    return rasiOrder[rasiIndex]
  }

  // Add custom styles once on component mount
  useEffect(() => {
    if (!document.getElementById("custom-xs-styles")) {
      const styleElement = document.createElement("style")
      styleElement.id = "custom-xs-styles"
      styleElement.innerHTML = customStyles
      document.head.appendChild(styleElement)

      return () => {
        const existingStyle = document.getElementById("custom-xs-styles")
        if (existingStyle) {
          document.head.removeChild(existingStyle)
        }
      }
    }
  }, [])

  // Reset custom positions when chart data or type changes
  useEffect(() => {
    setCustomPlanetPositions({})
  }, [chartData, chartType])

  // Get the current planet positions for display in the table
  const getCurrentPositions = () => {
    const positions = {}

    // Loop through all houses to extract planet positions
    traditionalLayout.forEach((house) => {
      if (house.planets && house.planets.length > 0) {
        // Get the rasi for this house
        const rasi = fixedHouseToRasiMap[house.house]
        const rasiIndex = rasiIndices[rasi]

        // Assign this position to each planet in the house
        house.planets.forEach((planet) => {
          positions[planet] = rasiIndex
        })
      }
    })

    return positions
  }

  // Find the lagna house
  const lagnaHouse = findLagnaHouse()

  // Get the actual navamsa lagna rasi for display in the center
  const getNavamsaLagnaRasi = () => {
    if (!chartData || chartType !== "navamsa") return lagnaRasi

    // For navamsa chart, find where lagna is placed
    const navamsaHouses = chartData.navamsa_houses || {}
    for (const [rasi, planets] of Object.entries(navamsaHouses)) {
      if (planets.includes("லக்னம்")) {
        return rasi
      }
    }
    return lagnaRasi
  }

  const displayRasi = chartType === "rasi" ? chartData?.rasi || "கும்பம்" : getNavamsaLagnaRasi()

  return (
    <TooltipProvider>
      <div className="w-full px-1 sm:px-0">
        {/* Chart Grid */}
        <div
          ref={chartRef}
          className="grid grid-cols-4 grid-rows-4 border-2 border-green-500 rounded-xl overflow-hidden aspect-square bg-green-50 max-w-[480px] mx-auto shadow-md"
        >
          {/* Render all houses */}
          {traditionalLayout.map((house) => (
            <DroppableHouse
              key={`house-${house.house}`}
              house={house}
              onDrop={handlePlanetDrop}
              isAscendant={house.house === lagnaHouse}
              onHouseClick={handleHouseClick}
              isDroppable={editMode}
              isHighlighted={house.house === highlightedHouse}
              rasiName={fixedHouseToRasiMap[house.house]}
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
                        {planetNames[planet] ? planetAbbreviations[planetNames[planet].tamil] : planet}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      {planetNames[planet] ? `${planetNames[planet].english} (${planetNames[planet].tamil})` : planet}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </DroppableHouse>
          ))}

          {/* Center cell spanning 2x2 */}
          <div
            className="col-span-2 row-span-2 border border-green-600 flex items-center justify-center bg-white"
            style={{
              gridColumnStart: 2,
              gridRowStart: 2,
            }}
          >
            <div className="text-center p-1 sm:p-2">
              <div className="text-lg sm:text-xl font-bold text-red-600 mb-0.5 sm:mb-1">
                {chartType === "rasi" ? "ராசி" : "நவாம்சம்"}
              </div>
              <div className="text-base sm:text-lg text-red-600">{displayRasi}</div>
              {editMode && (
                <div className="mt-1 sm:mt-2 text-[10px] sm:text-xs text-indigo-600 bg-indigo-50 p-0.5 sm:p-1 rounded">
                  {selectedPlanet ? `Place ${planetNames[selectedPlanet]?.english || selectedPlanet}` : "Select planet"}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Planet Positions Table */}
        <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-white shadow-sm print:hidden">
          <h3 className="text-sm font-medium mb-3 text-gray-700">Current Planet Positions:</h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
            {Object.entries(getCurrentPositions()).map(([planet, position]) => (
              <div key={planet} className="flex items-center text-sm">
                <div className="w-6 h-6 flex items-center justify-center mr-2 rounded-full bg-purple-100 text-purple-800 text-xs">
                  {planetNames[planet] ? planetAbbreviations[planetNames[planet].tamil] : planet}
                </div>
                <div className="truncate">
                  <span className="font-medium">{planetNames[planet]?.english || planet}:</span>{" "}
                  <span className="text-gray-700 text-xs">{getPlanetPositionName(position)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}

export default EditableHoroscopeChart
