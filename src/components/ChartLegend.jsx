function ChartLegend() {
    const planets = [
      { code: "SUN", tamil: "சூ", english: "Sun" },
      { code: "MOON", tamil: "சந்", english: "Moon" },
      { code: "MARS", tamil: "செவ்", english: "Mars" },
      { code: "MERCURY", tamil: "புத", english: "Mercury" },
      { code: "JUPITER", tamil: "குரு", english: "Jupiter" },
      { code: "VENUS", tamil: "சுக்", english: "Venus" },
      { code: "SATURN", tamil: "சனி", english: "Saturn" },
      { code: "RAHU", tamil: "ராகு", english: "Rahu" },
      { code: "KETU", tamil: "கேது", english: "Ketu" },
    ]
  
    return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-center text-indigo-800">Planet Legend</h3>
        <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
          {planets.map((planet) => (
            <div key={planet.code} className="flex items-center space-x-1 text-sm">
              <span className="font-bold">{planet.tamil}</span>
              <span className="text-gray-600">- {planet.english}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  
  export default ChartLegend
  
  