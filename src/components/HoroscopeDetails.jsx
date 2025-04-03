function HoroscopeDetails({ horoscopeData }) {
  if (!horoscopeData) return null;

  const {
    name,
    date,
    time,
    place,
    rasi,
    nakshatra,
    tithi,
    karana,
    yoga,
     planetaryPositions,
     dasha,
  } = horoscopeData;

  // Tamil names for planets
  const planetNames = {
    SUN: "சூரியன்",
    MOON: "சந்திரன்",
    MARS: "செவ்வாய்",
    MERCURY: "புதன்",
    JUPITER: "குரு",
    VENUS: "சுக்கிரன்",
    SATURN: "சனி",
    RAHU: "ராகு",
    KETU: "கேது",
  };
  console.log("Horoscope Data:", horoscopeData);
  console.log("Planetary Positions:", planetaryPositions);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Birth Details */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">பிறந்த விவரங்கள் (Birth Details)</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">பெயர்:</span> {name}</p>
            <p><span className="font-medium">பிறந்த தேதி:</span> {date}</p>
            <p><span className="font-medium">பிறந்த நேரம்:</span> {time}</p>
            <p><span className="font-medium">பிறந்த இடம்:</span> {place}</p>
          </div>
        </div>

        {/* Rasi & Nakshatra */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold text-lg mb-2">ஜாதக விவரங்கள் (Horoscope Details)</h3>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">ராசி:</span> {rasi}</p>
            <p><span className="font-medium">நட்சத்திரம்:</span> {nakshatra}</p>
            <p><span className="font-medium">நிலவு நாள்:</span> {tithi}</p>
            <p><span className="font-medium">கரணம்:</span> {karana}</p>
            <p><span className="font-medium">யோகம்:</span> {yoga}</p>
          </div>
        </div>
      </div>

      {/* Planetary Positions Table */}
      <div>
        <h3 className="font-semibold text-lg mb-3">📌 கிரக நிலைகள் (Planetary Positions)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">கிரகம்</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">திகாம்‌சம்</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ராசி</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">நட்சத்திரம்</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">பாதம்</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
            {Array.isArray(planetaryPositions) && planetaryPositions.length > 0 ? (
                planetaryPositions.map((planet, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {planetNames[planet.planet] || planet.planet}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{planet.position}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{planet.rasi}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{planet.nakshatra}</td>
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

      {/* Dasha Period */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h3 className="font-semibold text-lg mb-2">⏳ தசை இருப்பு (Dasha Period)</h3>
        <p className="text-sm">{dasha}</p>
      </div>
    </div>
  );
}

export default HoroscopeDetails;
