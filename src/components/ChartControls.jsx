"use client"

import React from "react"

export default function ChartControls({
  editMode,
  setEditMode,
  selectedPlanet,
  setSelectedPlanet,
  handleReset,
  planetNames,
  planetAbbreviations,
}) {
  const [showTutorial, setShowTutorial] = React.useState(false)
  const tutorialRef = React.useRef(null)

  React.useEffect(() => {
    if (!showTutorial) return

    function handleClickOutside(event) {
      if (tutorialRef.current && !tutorialRef.current.contains(event.target)) {
        setShowTutorial(false)
      }
    }

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside)

    // Clean up
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showTutorial])

  return (
    <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm print:hidden">
      <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
        <label className="inline-flex items-center cursor-pointer">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={editMode}
              onChange={() => setEditMode(!editMode)}
            />
            <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700">Edit Mode</span>
        </label>

        <div className="flex flex-wrap gap-2">
          {editMode && (
            <button
              onClick={handleReset}
              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-1 text-sm font-medium"
              aria-label="Reset positions to default"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
            className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors duration-200 flex items-center gap-1 text-sm font-medium"
            aria-label="Show help"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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
        </div>
      </div>

      <div className="text-sm text-gray-500 mt-2 sm:mt-0 w-full sm:w-auto print:hidden">
        {editMode ? (
          <span className="flex items-center text-purple-600 print:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 mr-1 print:hidden"
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
            {selectedPlanet ? `Place ${planetNames[selectedPlanet].english} in a house` : "Select a planet to place"}
          </span>
        ) : (
          <span>Enable Edit Mode to modify positions</span>
        )}
      </div>

      {/* Tutorial Panel */}
      {showTutorial && (
        <div
          ref={tutorialRef}
          className="absolute z-50 mt-16 p-4 bg-purple-50 border border-purple-200 rounded-xl text-sm print:hidden shadow-lg max-w-md"
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-md font-semibold text-purple-800">How to Use the Chart</h3>
            <button
              onClick={() => setShowTutorial(false)}
              className="text-purple-500 hover:text-purple-700"
              aria-label="Close tutorial"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <ol className="list-decimal pl-5 space-y-1 text-sm text-purple-800">
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
    </div>
  )
}

