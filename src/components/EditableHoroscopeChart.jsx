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
            px-2 py-1.5 sm:px-3 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all duration-200
            ${isSelected ? "bg-indigo-600 text-white shadow-md scale-110" : "bg-white border border-gray-300 hover:bg-gray-100"}
            ${isDragging ? "opacity-40 ring-2 ring-indigo-300" : "opacity-100"}
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
        border border-green-600 p-0.5 sm:p-1 flex flex-col relative transition-all duration-200
        ${isAscendant ? "bg-yellow-50" : ""}
        ${isActive ? "bg-indigo-100 ring-2 ring-indigo-500 scale-105" : ""}
        ${isDroppable ? "cursor-pointer hover:bg-indigo-50" : ""}
        ${isHighlighted ? "ring-2 ring-amber-400" : ""}
      `}
    >
      <div className="text-[10px] sm:text-xs text-gray-600 self-start font-medium">{house.house}</div>
      {isDroppable && isOver && (
        <div className="absolute inset-0 bg-indigo-200 bg-opacity-40 flex items-center justify-center pointer-events-none">
          <div className="text-indigo-600 font-medium text-sm">Drop Here</div>
        </div>
      )}
      {children}
      {isAscendant && <div className="text-[10px] sm:text-xs text-red-600 self-end">லக்</div>}
    </div>
  )
}

// Add new printChart function and update the EditableHoroscopeChart component
function EditableHoroscopeChart({ chartData, chartType, onChartUpdate }) {
  const [selectedPlanet, setSelectedPlanet] = useState(null)
  const [editMode, setEditMode] = useState(false)
  const [customPlanetPositions, setCustomPlanetPositions] = useState({})
  const [highlightedHouse, setHighlightedHouse] = useState(null)
  const [showTutorial, setShowTutorial] = useState(false)
  const chartRef = useRef(null)

  // Print functionality
  const printChart = () => {
    const printContent = document.createElement("div")
    printContent.innerHTML = `
      <style>
        @media print {
        .no-print { display: none !important; }
          body { margin: 0; padding: 20px; }
          .chart-container { page-break-inside: avoid; }
          .chart-title { font-size: 18px; font-weight: bold; text-align: center; margin-bottom: 10px; }
          .chart-grid { display: grid; grid-template-columns: repeat(4, 1fr); grid-template-rows: repeat(4, 1fr); border: 2px solid #059669; border-radius: 8px; overflow: hidden; aspect-ratio: 1/1; width: 100%; max-width: 500px; margin: 0 auto; }
          .chart-house { border: 1px solid #059669; padding: 8px; display: flex; flex-direction: column; position: relative; height: 120px; }
          .house-number { font-size: 10px; color: #4B5563; align-self: flex-start; }
          .house-planets { flex-grow: 1; display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 4px; }
          .planet { font-size: 12px; padding: 2px 6px; }
          .center-cell { grid-column: span 2; grid-row: span 2; display: flex; align-items: center; justify-content: center; text-align: center; }
          .chart-footer { margin-top: 15px; text-align: center; font-size: 12px; }
          .ascendant { background-color: #fefce8; }
          .ascendant-marker { font-size: 10px; color: #dc2626; align-self: flex-end; }
          @page { size: portrait; margin: 1cm; }
        }
      </style>
    `

    // Only copy the chart grid, not the editing controls
    const chartContent = chartRef.current?.cloneNode(true)
    chartContent.classList.add("chart-container")

    // Add title
    const title = document.createElement("div")
    title.classList.add("chart-title")
    title.innerText = chartType === "rasi" ? "ராசி (Rasi Chart)" : "நவாம்சம் (Navamsa Chart)"
    printContent.appendChild(title)

    // Add the chart
    chartContent.classList.add("chart-grid")
    printContent.appendChild(chartContent)

    // Add footer with date/time
    const footer = document.createElement("div")
    footer.classList.add("chart-footer")
    footer.innerText = `Generated on: ${new Date().toLocaleString()}`
    printContent.appendChild(footer)

    // Create a hidden iframe and print it
    const printFrame = document.createElement("iframe")
    printFrame.style.position = "absolute"
    printFrame.style.width = "0"
    printFrame.style.height = "0"
    printFrame.style.left = "-9999px"
    document.body.appendChild(printFrame)

    const frameDoc = printFrame.contentDocument || printFrame.contentWindow.document
    frameDoc.open()
    frameDoc.write("<html><head><title>Print Chart</title></head><body>")
    frameDoc.write(printContent.innerHTML)
    frameDoc.write("</body></html>")
    frameDoc.close()

    setTimeout(() => {
      printFrame.contentWindow.focus()
      printFrame.contentWindow.print()
      document.body.removeChild(printFrame)
    }, 500)
  }

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

  // Show tutorial on first edit mode activation
  useEffect(() => {
    // No automatic showing of tutorial
  }, [])

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
        ...getPlanetPositions(),
        [selectedPlanet]: position,
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
        ...getPlanetPositions(),
        [planet]: position,
      })
    }

    // Show a visual feedback of where planet was placed
    setHighlightedHouse(houseNumber)
    setTimeout(() => setHighlightedHouse(null), 1000)
  }

  // Reset to default positions
  const handleReset = () => {
    setCustomPlanetPositions({})
    setSelectedPlanet(null)

    if (onChartUpdate) {
      onChartUpdate(getDefaultPlanetPositions())
    }
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

  return (
    <TooltipProvider>
      <div className="w-full px-1 sm:px-0">
        {/* Edit Mode Controls */}
        <div className="mb-3 flex flex-col sm:flex-row sm:flex-wrap justify-between items-start sm:items-center gap-2 p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
            <label className="inline-flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={editMode}
                  onChange={() => setEditMode(!editMode)}
                />
                <div className="w-9 h-5 sm:w-11 sm:h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 sm:after:h-5 sm:after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </div>
              <span className="ml-2 text-xs sm:text-sm font-medium text-gray-700">Edit Mode</span>
            </label>

            <div className="flex flex-wrap gap-1.5">
              {editMode && (
                <button
                  onClick={handleReset}
                  className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors duration-200 flex items-center gap-1 text-xs sm:text-sm"
                  aria-label="Reset positions to default"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 sm:h-4 sm:w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Reset
                </button>
              )}

              <button
                onClick={() => setShowTutorial(!showTutorial)}
                className="px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors duration-200 flex items-center gap-1 text-xs sm:text-sm"
                aria-label="Show help"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 sm:h-4 sm:w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Help
              </button>

              <button
                onClick={printChart}
                className="px-2 py-1 sm:px-3 sm:py-1.5 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors duration-200 flex items-center gap-1 text-xs sm:text-sm"
                aria-label="Print chart"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 sm:h-4 sm:w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                  />
                </svg>
                Print
              </button>
            </div>
          </div>

          <div className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-0 w-full sm:w-auto print:hidden">
            {editMode ? (
              <span className="flex items-center text-indigo-600 print:hidden">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3 sm:h-4 sm:w-4 mr-1 print:hidden"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                {selectedPlanet
                  ? `Place ${planetNames[selectedPlanet].english} in a house`
                  : "Select a planet to place"}
              </span>
            ) : (
              <span>Enable Edit Mode to modify positions</span>
            )}
          </div>
        </div>

        {/* Tutorial Panel */}
        {showTutorial && (
          <div className="mb-3 p-2 sm:p-4 bg-blue-50 border border-blue-200 rounded-lg text-xs sm:text-sm">
            <div className="flex justify-between items-center mb-1 sm:mb-2">
              <h3 className="text-sm sm:text-md font-semibold text-blue-800">How to Use the Chart</h3>
              <button
                onClick={() => setShowTutorial(false)}
                className="text-blue-500 hover:text-blue-700"
                aria-label="Close tutorial"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <ol className="list-decimal pl-4 sm:pl-5 space-y-0.5 sm:space-y-1 text-xs sm:text-sm text-blue-800">
              <li>
                Enable <strong>Edit Mode</strong> using the toggle
              </li>
              <li>Choose a planet from the selection panel</li>
              <li>Click on any house to place the planet</li>
              <li>Or drag planets directly onto houses</li>
              <li>
                Use <strong>Reset</strong> to restore defaults
              </li>
              <li>
                Click <strong>Print</strong> to print your chart
              </li>
            </ol>
          </div>
        )}

        {/* Planet Selection in Edit Mode */}
        {editMode && (
          <div className="mb-3 p-2 sm:p-4 border border-gray-300 rounded-md bg-white shadow-sm">
            <h3 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-gray-700">Select Planet:</h3>
            <div className="flex flex-wrap gap-1 sm:gap-2">
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
        )}

        {/* Chart Grid */}
        <div
          ref={chartRef}
          className="grid grid-cols-4 grid-rows-4 border-2 border-green-600 rounded-lg overflow-hidden aspect-square bg-green-50 max-w-[480px] mx-auto"
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
                <div className="text-base sm:text-lg text-red-600">{chartData?.moon?.rasi || "கும்பம்"}</div>
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
        <div className="mt-3 p-2 sm:p-4 border border-gray-300 rounded-md bg-white shadow-sm">
          <h3 className="text-xs sm:text-sm font-medium mb-2 sm:mb-3 text-gray-700">Current Planet Positions:</h3>
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-y-1.5 sm:gap-y-2 gap-x-2 sm:gap-x-4">
            {Object.entries(getPlanetPositions()).map(([planet, position]) => {
              return (
                <div key={planet} className="flex items-center text-xs sm:text-sm">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center mr-1.5 sm:mr-2 rounded-full bg-indigo-100 text-indigo-800 text-[10px] sm:text-xs">
                    {planetAbbreviations[planet]}
                  </div>
                  <div className="truncate">
                    <span className="font-medium">{planetNames[planet].english}:</span>{" "}
                    <span className="text-gray-700 text-[10px] sm:text-xs">{getPlanetPositionName(position)}</span>
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

