"use client"

import { useState, useRef } from "react"
import axios from "axios"
import HoroscopeForm from "./components/HoroscopeForm"
import EditableHoroscopeChart from "./components/EditableHoroscopeChart"
import HoroscopeDetails from "./components/HoroscopeDetails"
import ChartControls from "./components/ChartControls"
import PlanetSelector from "./components/PlanetSelector"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
import { TooltipProvider } from "./components/Tooltip"

function App() {
  const [horoscopeData, setHoroscopeData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [chartPositions, setChartPositions] = useState({
    rasi: {},
    navamsa: {},
  })
  const BASE_URL=import.meta.env.VITE_BASE_URL
  const ENDPOINT=import.meta.env.VITE_ENDPOINT_NAME
  // Add shared edit mode state
  const [editMode, setEditMode] = useState(false)
  const [selectedPlanet, setSelectedPlanet] = useState(null)

  const printRef = useRef()
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

const fetchHoroscope = async (formData) => {
  setLoading(true)
  setError(null)

  try {
    const response = await axios.post(`${BASE_URL}${ENDPOINT}`, formData)

    // This only runs if the response is 2xx
    const data = response.data // no need for .json() with axios

    const planetaryPositions = Array.isArray(data["நிராயன ஸ்புடங்கள்"]) ? data["நிராயன ஸ்புடங்கள்"] : []

    setHoroscopeData({
      name: data["பெயர்"],
      date: data["பிறந்த நாள்"],
      time: data["பிறந்த நேரம்"],
      place: data["பிறந்த இடம்"],
      latitude: data["அகலாங்கு"],
      longitude: data["நெட்டாங்கு"],
      rasi: data["ராசி"],
      nakshatra: data["விண்மீன்"],
      tithi: data["திதி"],
      karana: data["கரணம்"],
      yoga: data["யோகம்"],
      planetaryPositions,
      dasha: data["தசை இருப்பு"],
      rasi_houses:data["ராசி வீடுகள்"],
      navamsa_houses:data["நவாம்ச வீடுகள்"],
      ayanasam:data["அயனாம்சம்"],
      Lagna: data["உதய லக்னம்"],
      sutham:data["சுத்த ஜாதகம்"]
    })

    // Reset chart positions
    setChartPositions({
      rasi: {},
      navamsa: {},
    })
  } catch (err) {
    // Handle both network and server errors
    if (err.response) {
      // Server responded with a status other than 2xx
      console.error('Server responded with:', err.response.data)
      setError(`Server error: ${err.response.status} - ${err.response.data.message || 'Unknown error'}`)
    } else if (err.request) {
      // No response received
      console.error('No response received:', err.request)
      setError("No response from server. Please check your connection.")
    } else {
      // Something else went wrong
      console.error('Error:', err.message)
      setError(`Error: ${err.message}`)
    }
  } finally {
    setLoading(false)
  }
}

  const handlePrint = () => {
    window.print()
  }

  // Function to reset chart positions
  const handleReset = () => {
    setChartPositions({
      rasi: {},
      navamsa: {},
    })
    setSelectedPlanet(null)
  }

  const [resetKey, setResetKey] = useState(0)

  const handleResetAll = () => {
    setChartPositions({
      rasi: {},
      navamsa: {},
    })
    setSelectedPlanet(null)
    setResetKey((prevKey) => prevKey + 1) // Increment the key to force re-render
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <TooltipProvider>
        <div className="min-h-screen bg-gray-100 py-8 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              {/* Title */}
              <h1 className="text-3xl font-bold text-indigo-800 flex-grow text-center">ஜாதக கணிப்பு</h1>

              {/* Print Button - Aligned to the Right */}
              {horoscopeData && (
                <button
                  onClick={handlePrint}
                  className="print:hidden bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-700 transition flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                  Print
                </button>
              )}
            </div>

            {/* Hide during print */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8 print:hidden">
              <HoroscopeForm onSubmit={fetchHoroscope} />
            </div>

            {loading && (
              <div className="text-center py-8 print:hidden">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
                <p className="mt-2 text-gray-600">Loading horoscope data...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-8 print:hidden">
                <p>{error}</p>
              </div>
            )}

            {horoscopeData && (
              <>
                {/* Common Edit Controls - Added here */}
                <ChartControls
                  editMode={editMode}
                  setEditMode={setEditMode}
                  selectedPlanet={selectedPlanet}
                  setSelectedPlanet={setSelectedPlanet}
                  handleReset={handleResetAll}
                  planetNames={planetNames}
                  planetAbbreviations={planetAbbreviations}
                />

                {/* Common Planet Selector - Added here */}
                <PlanetSelector
                  editMode={editMode}
                  selectedPlanet={selectedPlanet}
                  setSelectedPlanet={setSelectedPlanet}
                  planetAbbreviations={planetAbbreviations}
                  planetNames={planetNames}
                />

                {/* Printable Section */}
                <div id="print-section" ref={printRef} className="bg-white rounded-lg shadow-lg p-2">
                  {/* Horoscope Details */}
                  <div className="mt-6">
                    <HoroscopeDetails
                      horoscopeData={horoscopeData}
                      customRasiPositions={chartPositions.rasi}
                      customNavamsaPositions={chartPositions.navamsa}
                      chartType="rasi"
                    />
                  </div>

                  {/* Two Charts in Single Row */}
                  <div className="grid grid-cols-2 gap-3" style={{ paddingBottom: "60px" }}>
                    <div>
                      <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-800">ராசி</h2>
                      <EditableHoroscopeChart
                        key={`rasi-${resetKey}`}
                        chartData={horoscopeData}
                        chartType="rasi"
                        onChartUpdate={(data) => {
                          if (data.chartType === "rasi") {
                            setChartPositions((prev) => ({
                              ...prev,
                              rasi: data.positions,
                            }))
                          }
                        }}
                        // Pass shared state
                        editMode={editMode}
                        selectedPlanet={selectedPlanet}
                        setSelectedPlanet={setSelectedPlanet}
                      />
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-800">நவாம்சம்</h2>
                      <EditableHoroscopeChart
                        key={`navamsa-${resetKey}`}
                        chartData={horoscopeData}
                        chartType="navamsa"
                        onChartUpdate={(data) => {
                          if (data.chartType === "navamsa") {
                            setChartPositions((prev) => ({
                              ...prev,
                              navamsa: data.positions,
                            }))
                          }
                        }}
                        // Pass shared state
                        editMode={editMode}
                        selectedPlanet={selectedPlanet}
                        setSelectedPlanet={setSelectedPlanet}
                      />
                    </div>
                  </div>
                  {/* Planetary Positions Table */}
                  {horoscopeData.planetaryPositions && (
                    <div className="mt-6">
                      <h3 className="font-semibold text-lg mb-3">📌 கிரக நிலைகள்</h3>
                      <div className="overflow-x-auto no-break">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                கிரகம்
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                திகாம்‌சம்
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ராசி
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                நட்சத்திரம்
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                பாதம்
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {horoscopeData.planetaryPositions.length > 0 ? (
                              horoscopeData.planetaryPositions.map((planet, index) => (
                                <tr key={index}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {planetNames[planet.planet]?.tamil || planet.planet}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {planet.position}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{planet.rasi}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {planet.nakshatra}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{planet.pada}</td>
                                </tr>
                              ))
                            ) : (
                              <tr>
                                <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                                  🔍 No planetary data available
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Dasha Period */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">⏳ தசை இருப்பு</h3>
                    <p className="text-sm">{horoscopeData.dasha}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg shadow-md hover:shadow-lg transition duration-300 flex justify-center items-center text-center">
                    <p className="text-gray-800 font-semibold">
                      by OMS - <span className="text-blue-500">📞+91 8148160694</span>
                    </p>
                  </div>
                </div>

                {/* Print Button - Hidden in print mode */}
                <div className="text-center mt-6 print:hidden">
                  <button
                    onClick={handlePrint}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 mx-auto"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6 9 6 2 18 2 18 9"></polyline>
                      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                      <rect x="6" y="14" width="12" height="8"></rect>
                    </svg>
                    Print Horoscope
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </TooltipProvider>
    </DndProvider>
  )
}

export default App

