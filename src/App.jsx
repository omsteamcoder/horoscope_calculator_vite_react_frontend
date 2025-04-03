"use client"

import { useState, useRef } from "react"
import HoroscopeForm from "./components/HoroscopeForm"
import EditableHoroscopeChart from "./components/EditableHoroscopeChart"
import HoroscopeDetails from "./components/HoroscopeDetails"
import { DndProvider } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"

function App() {
  const [horoscopeData, setHoroscopeData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [rasiPlanetPositions, setRasiPlanetPositions] = useState({})
  const [navamsaPlanetPositions, setNavamsaPlanetPositions] = useState({})
  
  const printRef = useRef()

  const fetchHoroscope = async (formData) => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("http://localhost:5000/horoscope", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error("Failed to fetch horoscope data")

      const data = await response.json()

      console.log("Horoscope Data:", data)

      const planetaryPositions = Array.isArray(data["நிராயன ஸ்புடங்கள்"])
        ? data["நிராயன ஸ்புடங்கள்"]
        : []

      setHoroscopeData({
        name: data["பெயர்"],
        date: data["பிறந்த நாள்"],
        time: data["பிறந்த நேரம்"],
        place: data["பிறந்த இடம்"],
        rasi: data["ராசி"],
        nakshatra: data["விண்மீன்"],
        tithi: data["திதி"],
        karana: data["கரணம்"],
        yoga: data["யோகம்"],
        planetaryPositions,
        dasha: data["தசை இருப்பு"],
      })

      setRasiPlanetPositions({})
      setNavamsaPlanetPositions({})
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8 text-indigo-800">
            ஜாதக கணிப்பு (Horoscope Calculator)
          </h1>

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
              {/* Printable Section */}
              <div id="print-section" ref={printRef} className="bg-white rounded-lg shadow-lg p-6">
                
                {/* Two Charts in Single Row */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-800">
                      ராசி (Rasi Chart)
                    </h2>
                    <EditableHoroscopeChart
                      chartData={horoscopeData}
                      chartType="rasi"
                    />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-800">
                      நவாம்சம் (Navamsa Chart)
                    </h2>
                    <EditableHoroscopeChart
                      chartData={horoscopeData}
                      chartType="navamsa"
                    />
                  </div>
                </div>

                {/* Horoscope Details */}
                <div className="mt-6">
                  <h2 className="text-2xl font-semibold mb-4 text-center text-indigo-800">
                    கிரக நிலைகள் (Planetary Positions)
                  </h2>
                  <HoroscopeDetails
                    horoscopeData={horoscopeData}
                    customRasiPositions={rasiPlanetPositions}
                    customNavamsaPositions={navamsaPlanetPositions}
                    chartType="rasi"
                  />
                </div>
              </div>

              {/* Print Button - Hidden in print mode */}
              <div className="text-center mt-6 print:hidden">
                <button
                  onClick={handlePrint}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow-md hover:bg-indigo-700 transition"
                >
                  Print
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </DndProvider>
  )
}

export default App
